import { action, makeObservable, computed, observable } from 'mobx';
import { FormConfig } from '../types/default';
import Joi from 'joi';
import BaseStore from './BaseStore';
import { ReplaceTypes } from '../helper/ObjectManipulation';
import { APIResponseData, ResponsePagination } from '../services/CallServer';
import { Tag, Switch } from 'antd';
import { TableConfig } from '../components/control/AntdTable';
import { ColumnsType } from 'antd/lib/table';

interface ISOpen {
  formResource: boolean;
}

interface IPayload {
  code: string;
  name_id: string;
  name_en: string;
  description: string;
  is_parent: boolean;
  parent_id: number | null;
}

type TErrMsg = ReplaceTypes<IPayload, string>;

type TSchema = {
  [key in keyof IPayload]: Joi.AnySchema;
};

type BaseRows = {
  id: string | number;
  uuid: string;
  code: string;
  name_id: string;
  name_en: string;
  is_active: boolean;
};

type Row = BaseRows & {
  is_parent: boolean;
  parent_id: string | number;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string;
  deleted_by: string | null;
  childs: BaseRows[];
  parent: BaseRows;
};

const SCHEMA: TSchema = {
  is_parent: Joi.boolean(),
  parent_id: Joi.when('is_parent', {
    is: false,
    then: Joi.number().min(1).messages({
      'number.base': 'Parent is required',
      'number.min': 'Parent is required',
    }),
    otherwise: Joi.optional(),
  }),
  code: Joi.string().messages({
    'string.empty': 'Code is required',
  }),
  name_id: Joi.string().messages({
    'string.empty': 'Name in Indonesia is required',
  }),
  name_en: Joi.string().messages({
    'string.empty': 'Name in English is required',
  }),
  description: Joi.string().messages({
    'string.empty': 'Description is required',
  }),
};

const INIT = {
  is_parent: false,
  parent_id: null,
  code: '',
  name_id: '',
  name_en: '',
  description: '',
};

class ResourceStore extends BaseStore<Row, IPayload, TSchema, TErrMsg> {
  public parent: Row[];

  constructor() {
    super({ routeTarget: 'RESOURCE' });
    this.payload = { ...INIT };
    this.errMsg = { ...INIT, is_parent: '', parent_id: '' };
    this.schema = SCHEMA;
    this.parent = [];

    makeObservable(this, {
      parent: observable,

      isPayloadValid: computed,
      formConfig: computed,
      tableConfig: computed,
      columns: computed,
      parentList: computed,

      getAll: action,
      create: action,
      handleOpen: action,
      handleClose: action,
      handleOK: action,
      validatePayload: action,
      validation: action,
      setParent: action,
    });
  }

  get columns(): ColumnsType<Row> {
    const cols: ColumnsType<Row> = [
      {
        key: 'id',
        dataIndex: 'id',
        width: 100,
        title: 'ID',
        fixed: 'left',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'created_at',
        dataIndex: 'created_at',
        title: 'Created At',
        sorter: true,
        render: (value) => {
          return value.slice(0, 10).split('-').reverse().join('-');
        },
      },
      {
        key: 'is_parent',
        dataIndex: 'is_parent',
        title: 'Is Parent?',
        sorter: true,
        filters: [
          {
            text: 'Yes',
            value: true,
          },
          {
            text: 'No',
            value: false,
          },
        ],
        render: (value) => <Tag color={value ? 'blue' : 'default'}>{value ? 'Yes' : 'No'}</Tag>,
      },
      {
        key: 'parent_id',
        dataIndex: 'parent_id',
        title: 'Parent',
        sorter: true,
        render: (_, row) => {
          return row.parent?.name_en || '-';
        },
      },
      { key: 'code', dataIndex: 'code', title: 'Code', width: 160, sorter: true },
      { key: 'name_id', dataIndex: 'name_id', title: 'Name ID', width: 160, sorter: true },
      { key: 'name_en', dataIndex: 'name_en', title: 'Name EN', width: 160, sorter: true },
      {
        key: 'is_active',
        dataIndex: 'is_active',
        title: 'Action',
        fixed: 'right',
        sorter: true,
        render: (value, row) => {
          return (
            <Switch
              size='small'
              checked={value}
              checkedChildren='active'
              unCheckedChildren='inactive'
              onChange={() => this.pathcStatus(row.uuid, !value)}
            />
          );
        },
      },
    ];
    return cols;
  }

  get formConfig(): FormConfig {
    return {
      title: 'Form Resource',
      description: '',
      open: this.isOpen.formResource,
      loading: this.loading,
      handleClose: () => this.handleClose('formResource'),
      handleOK: () => this.handleOK(),
    };
  }

  get tableConfig(): TableConfig<Row> {
    return {
      rows: this.dataRows,
      cols: this.columns,
      page: this.meta?.current_page,
      perPage: this.meta?.per_page,
      totalRow: this.meta?.total,
      loading: this.loading,
      onChangePagination: console.log,
      onChangeTable: (pg, ft, st, et) => this.onChangeTable(pg, ft, st, et),
    };
  }

  get parentList() {
    const temps = this.parent.map((el) => {
      return { value: el.id, label: `${el.id} - ${el.name_en}` };
    });
    return temps;
  }

  get isPayloadValid(): boolean {
    const isValid = this.checkErrorMsg(this.errMsg);
    return isValid;
  }

  get activeModal(): ISOpen {
    const actives = this.isOpen as any;
    return actives as ISOpen;
  }

  setParent(rows: Row[]) {
    this.parent = rows;
  }

  handleOpen(key: keyof ISOpen) {
    this.isOpen[key] = true;
  }

  handleClose(key: keyof ISOpen) {
    this.payload = { ...INIT };
    this.errMsg = { ...INIT, is_parent: '', parent_id: '' };
    this.isOpen[key] = false;
  }

  async handleOK() {
    const isValid = this.validation();
    if (isValid) {
      await this.create();
    }
  }

  validation(): boolean {
    const { isValid, objError } = this.validatePayload(this.schema, this.payload);
    this.errMsg = objError;
    return isValid;
  }

  // HTTP Server Request
  async getAll() {
    try {
      this.setLoading(true, 'fetch');
      const response: ResponsePagination<Row> = await this.httpService.index(this.filters);
      const { meta, rows } = response.data;
      this.setRows(rows);
      this.setMeta(meta);
    } catch (error) {
      // console.error('error index', error);
    } finally {
      this.setLoading(false, 'fetch', true);
    }
  }

  async create() {
    try {
      this.setLoading(true, 'create');
      await this.httpService.store(this.payload);
      this.throwMessage().success('create', 'Success add new resources');
      this.handleClose('formResource');
      await this.getAll();
    } catch (error) {
      const err = error as any;
      if (err?.response) {
        const { data } = err.response.data;
        if (data.errorCode === 'VALIDATION_FAILURE') {
          this.setErrMsg({ ...this.errMsg, ...data.errMsg });
        }
      }
      this.throwMessage().warning('create', 'Failed add new resource');
    } finally {
      this.setLoading(false, 'create');
    }
  }

  async getParent() {
    try {
      this.setLoading(true, 'fetch');
      const resp = (await this.httpService.index({ isPagination: false, isParent: true })) as APIResponseData<Row[]>;
      this.setParent(resp.data);
    } catch (error) {
      // console.error('error index', error);
    } finally {
      this.setLoading(false, 'fetch', true);
    }
  }
}

export default ResourceStore;
