import Joi from 'joi';
import { action, computed, makeObservable, observable } from 'mobx';
import { destroyMessage, openLoadingMessage, openSuccessMessage, openWarningMessage } from '../helper/Feedback';
import ObjectManipulation, { ReplaceTypes } from '../helper/ObjectManipulation';
import { MetaPagination, TUrl } from '../services/CallServer';
import HTTPService, { TQueryIndex } from '../services/HTTPService';

type TOpen = Record<string, boolean>;
type KeyMessage = 'fetch' | 'create' | 'update';
type TParams = {
  routeTarget: TUrl;
};

const initMeta: MetaPagination = {
  total: 0,
  per_page: 10,
  current_page: 1,
  last_page: 0,
  first_page: 0,
  first_page_url: null,
  last_page_url: null,
  next_page_url: null,
  previous_page_url: null,
};

class BaseStore<R, P, S, E> {
  public isOpen: TOpen;
  public loading = false;
  public httpService: HTTPService;
  public meta: MetaPagination;
  public rows: R[];
  public filters: TQueryIndex;
  public payload: P;
  public schema: S;
  public errMsg: E;

  constructor(params: TParams) {
    this.httpService = new HTTPService(params.routeTarget);
    this.isOpen = {
      formResource: false,
    };
    this.payload = {} as P;
    this.schema = {} as S;
    this.errMsg = {} as E;
    this.loading = false;
    this.rows = [];
    this.meta = { ...initMeta };
    this.filters = {};

    makeObservable(this, {
      isOpen: observable,
      loading: observable,
      rows: observable,
      meta: observable,
      filters: observable,
      payload: observable,
      errMsg: observable,

      queryParam: computed,

      setRows: action,
      setMeta: action,
      setLoading: action,
      setFilters: action,
      setPayload: action,
      setErrMsg: action,
    });
  }

  throwMessage() {
    return {
      loading: (key: KeyMessage, msg?: string) => openLoadingMessage(key, msg),
      success: (key: KeyMessage, msg?: string) => openSuccessMessage(key, msg),
      warning: (key: KeyMessage, msg?: string) => openWarningMessage(key, msg),
      dismiss: (key: KeyMessage) => destroyMessage(key),
    };
  }

  get queryParam() {
    const newFilter = { ...this.filters };
    if (!newFilter.page) newFilter.page = this.meta.current_page + 1;
    if (!newFilter.perPage) newFilter.perPage = this.meta.per_page;
    return newFilter;
  }

  setRows(rows: R[]) {
    this.rows = rows;
  }

  setMeta(meta: MetaPagination) {
    this.meta = meta;
  }

  setFilters(filters: TQueryIndex) {
    this.filters = filters;
  }

  setLoading(value: boolean, key: KeyMessage, dismiss?: boolean) {
    if (value) this.throwMessage().loading(key || 'loading', 'Please wait...');
    else if (!value && dismiss) {
      this.throwMessage().dismiss(key);
    }

    this.loading = value;
  }

  setPayload(payload: P) {
    this.payload = payload;
  }

  setErrMsg(errMsg: E) {
    this.errMsg = errMsg;
  }

  checkErrorMsg<T extends object>(errMsg: T): boolean {
    let isValid = true;
    for (const k in errMsg) {
      if (Object.prototype.hasOwnProperty.call(errMsg, k)) {
        const key = k as keyof T;
        const element = errMsg[key];
        if (element) isValid = false;
      }
    }
    return isValid;
  }

  validatePayload<T extends object, P extends object>(
    schema: {
      [key in keyof T]: Joi.AnySchema;
    },
    payload: P,
  ): { isValid: boolean; objError: ReplaceTypes<P, string> } {
    let isValid = true;
    const allSchema = Joi.object().keys({
      ...schema,
    });
    const objError = ObjectManipulation.replaceNestedValues(payload, '');
    const result = allSchema.validate(payload, { abortEarly: false, allowUnknown: true });
    if (result.error) {
      isValid = false;
      result.error.details.forEach((el) => {
        ObjectManipulation.setObjectByString(objError, el.path.join('.'), el.message);
      });
    }
    return { isValid, objError };
  }
}

export default BaseStore;
