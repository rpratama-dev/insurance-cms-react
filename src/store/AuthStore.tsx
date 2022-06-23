import Joi from 'joi';
import { action, makeObservable, observable } from 'mobx';
import { APIResponseData } from '../services/CallServer';
import BaseStore from './BaseStore';

type Session = {
  isLogedIn: boolean;
  credentials: {
    id: string;
    uuid: string;
    name: string;
    email: string;
    last_login: string;
    phone_number: string;
    remember_me_token: string;
    picture?: string;
  };
  idToken: string;
};

type ResponseData = {
  user: Session['credentials'];
  auth: {
    type: 'bearer';
    token: string;
    expires_at: string;
  };
};

type Payload = {
  email: string;
  password: string;
  remember_me_token: boolean;
};

type ErrMsg = {
  email: string;
  password: string;
  remember_me_token: string;
};

type TSchema = {
  [key in keyof ErrMsg]: Joi.AnySchema;
};

class AuthStore extends BaseStore {
  public session: Session = {
    isLogedIn: false,
    credentials: {
      id: '',
      uuid: '',
      name: '',
      email: '',
      last_login: '',
      phone_number: '',
      remember_me_token: '',
      picture: '',
    },
    idToken: '',
  };
  public payload: Payload = {
    email: '',
    password: '',
    remember_me_token: false,
  };
  public errMsg: ErrMsg = {
    email: '',
    password: '',
    remember_me_token: '',
  };
  public schema: TSchema = {
    email: Joi.string().email({ tlds: false }).messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be valid',
    }),
    password: Joi.string().messages({
      'string.empty': 'Password is required',
    }),
    remember_me_token: Joi.boolean(),
  };
  public errorResponse = '';

  constructor() {
    super({ routeTarget: 'AUTH' });
    makeObservable(this, {
      session: observable,
      payload: observable,
      errorResponse: observable,

      validation: action,
      postLogin: action,
      handlePayload: action,
    });
  }

  validate(field: keyof ErrMsg, value: any) {
    const newErrMsg = { ...this.errMsg, [field]: '' };
    const newSchema = this.schema[field];
    const validator = newSchema.validate(value);
    validator.error?.details.forEach((el) => {
      newErrMsg[(el.path[0] || field) as keyof ErrMsg] = el.message || '';
    });
    this.errMsg = newErrMsg;
  }

  validation(): boolean {
    const { isValid, objError } = this.validatePayload(this.schema, this.payload);
    console.log({ objError });

    this.errMsg = objError;
    return isValid;
  }

  handlePayload(payload: Payload) {
    this.payload = payload;
  }

  async handleOK() {
    const isValid = this.validation();
    console.log({ login: 'here', isValid });
    if (isValid) {
      await this.postLogin();
    }
  }

  async postLogin() {
    try {
      this.setLoading(true, 'create');
      const response: APIResponseData<ResponseData> = await this.httpService.store(this.payload);
      const session: Session = {
        isLogedIn: true,
        credentials: response.data.user,
        idToken: response.data.auth.token,
      };
      this.session = session;
      this.throwMessage().success('create', `Access Granted. Welcome ${session.credentials.name}`);
    } catch (error: any) {
      if (error?.response) {
        this.errorResponse = error.response.data.message;
      }
    } finally {
      this.setLoading(false, 'create');
    }
  }
}

export default AuthStore;
