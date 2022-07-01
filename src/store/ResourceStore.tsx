import { action, makeObservable, computed, observable } from 'mobx';
import { FormConfig } from '../types/default';
import Joi from 'joi';
import BaseStore from './BaseStore';
import { ReplaceTypes } from '../helper/ObjectManipulation';
import { APIResponseData, ResponsePagination } from '../services/CallServer';
import { GridColDef } from '@mui/x-data-grid';

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

type Row = {
  id: string | number;
  uuid: string;
  is_parent: boolean;
  parent_id: string | number;
  code: string;
  name_id: string;
  name_en: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string;
  deleted_by: string | null;
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

  get columns(): GridColDef[] {
    const cols: GridColDef[] = [
      { field: 'id', headerName: 'ID' },
      { field: 'created_at', headerName: 'Create At' },
      { field: 'is_parent', headerName: 'Is Parent?' },
      { field: 'parent_id', headerName: 'Parent ID' },
      { field: 'code', headerName: 'Code' },
      { field: 'name_id', headerName: 'Name ID' },
      { field: 'name_en', headerName: 'Name EN' },
      { field: 'description', headerName: 'Description' },
      { field: 'is_active', headerName: 'Active' },
      { field: 'updated_at', headerName: 'Update AT' },
      { field: 'uuid', headerName: 'UUID' },
      // {
      //   field: 'fullName',
      //   headerName: 'Full name',
      //   description: 'This column has a value getter and is not sortable.',
      //   sortable: false,
      //   width: 160,
      //   // valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      //   renderCell: (params: GridRenderCellParams) => {
      //     return <h6>{params.row.firstName + '-' + params.row.age || ''}</h6>;
      //   },
      // },
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
      const response: ResponsePagination<Row> = await this.httpService.index({ page: 1, perPage: 10 });
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
    } catch (error) {
      const err = error as any;
      if (err?.response) {
        const { data } = err.response.data;
        if (data.errorCode === 'VALIDATION_FAILURE') {
          this.setErrMsg({ ...this.errMsg, ...data.errMsg });
        }
        console.log(data);
      }
      // console.error('error index', error);
      this.throwMessage().warning('create', 'Failed add new resource');
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
