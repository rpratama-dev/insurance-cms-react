import { action, makeObservable, observable, computed } from 'mobx';
import { FormConfig } from '../types/default';
import Joi from 'joi';
import BaseStore from './BaseStore';
import { ReplaceTypes } from '../helper/ObjectManipulation';

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

class ResourceStore extends BaseStore {
  public payload: IPayload;
  public schema: TSchema;
  public errMsg: TErrMsg;

  constructor() {
    super({ routeTarget: 'RESOURCE' });
    this.payload = { ...INIT };
    this.errMsg = { ...INIT, is_parent: '', parent_id: '' };
    this.schema = SCHEMA;

    makeObservable(this, {
      payload: observable,
      errMsg: observable,

      isPayloadValid: computed,
      formConfig: computed,

      getAll: action,
      create: action,
      handleOpen: action,
      handleClose: action,
      handleOK: action,
      handleChangePayload: action,
      handleChangeError: action,
      validatePayload: action,
      validation: action,
    });
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

  get isPayloadValid(): boolean {
    const isValid = this.checkErrorMsg(this.errMsg);
    return isValid;
  }

  get activeModal(): ISOpen {
    const actives = this.isOpen as any;
    return actives as ISOpen;
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
      this.handleClose('formResource');
    }
  }

  handleChangePayload(payload: IPayload) {
    this.payload = payload;
  }

  handleChangeError(errMsg: TErrMsg) {
    this.errMsg = errMsg;
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
      const data = await this.httpService.index({ page: 1, perPage: 10 });
      console.log(data);
    } catch (error) {
      // console.error('error index', error);
    } finally {
      this.setLoading(false, 'fetch', true);
    }
  }

  async create() {
    try {
      this.setLoading(true, 'create');
      const data = await this.httpService.store(this.payload);
      console.log(data);
      this.throwMessage().success('create', 'Success add new resources');
    } catch (error) {
      // console.error('error index', error);
    } finally {
      this.setLoading(false, 'create');
    }
  }
}

export default ResourceStore;
