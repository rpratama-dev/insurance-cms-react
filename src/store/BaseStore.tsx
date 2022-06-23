import Joi from 'joi';
import { action, makeObservable, observable } from 'mobx';
import { destroyMessage, openLoadingMessage, openSuccessMessage, openWarningMessage } from '../helper/Feedback';
import ObjectManipulation, { ReplaceTypes } from '../helper/ObjectManipulation';
import { TUrl } from '../services/CallServer';
import HTTPService from '../services/HTTPService';

type TOpen = Record<string, boolean>;
type KeyMessage = 'fetch' | 'create' | 'update';
type TParams = {
  routeTarget: TUrl;
};

class BaseStore {
  public isOpen: TOpen;
  public loading = false;
  public httpService: HTTPService;

  constructor(params: TParams) {
    this.httpService = new HTTPService(params.routeTarget);
    this.isOpen = {
      formResource: false,
    };
    this.loading = false;
    makeObservable(this, {
      isOpen: observable,
      loading: observable,

      setLoading: action,
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

  setLoading(value: boolean, key: KeyMessage, dismiss?: boolean) {
    if (value) this.throwMessage().loading(key || 'loading', 'Please wait...');
    else if (!value && dismiss) {
      this.throwMessage().dismiss(key);
    }

    this.loading = value;
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
