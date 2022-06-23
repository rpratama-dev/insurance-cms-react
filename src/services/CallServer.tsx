import { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import HTTPClient, { defaultHeaders } from './AxiosInstance';
import ServerAPI from './ServerAPI';

type LocalAPI = {
  TEST: string;
};
export type TUrl = keyof typeof ServerAPI | keyof LocalAPI;
export type TOption = {
  param?: string;
  query?: object;
  formData?: boolean;
};

export type APIResponseData<Data extends object> = {
  message: string;
  data: Data;
  status: 'success' | 'fail';
};

type InstanceName = 'local' | 'insuranceApi';
type AxiosList = {
  [key in InstanceName]: () => AxiosInstance;
};

type Routes = {
  [key in InstanceName]: typeof ServerAPI | Record<string, any>;
};

type APIResponse<D extends object> = AxiosResponse<APIResponseData<D>, any>;

const axiosList: AxiosList = {
  insuranceApi: HTTPClient.apiBackend,
  local: HTTPClient.apiNextJS,
};

class CallServer {
  // private ROUTE: typeof ServerAPI;
  private Instace: AxiosInstance;
  private config: AxiosRequestConfig;
  private instanceName: InstanceName;
  private routes: Routes = {
    insuranceApi: ServerAPI,
    local: { TEST: '' },
  };

  constructor(instanceName: InstanceName = 'insuranceApi') {
    this.instanceName = instanceName;
    this.Instace = axiosList[instanceName]();
    this.config = {};
  }

  parseHeaders(formData?: boolean): AxiosRequestHeaders {
    const headers = defaultHeaders(formData);
    return headers;
  }

  private passRoute(routeName: TUrl, opt?: TOption) {
    const temps: any = this.routes;
    let route: string = temps[this.instanceName][routeName];
    let query = '';

    if (opt && opt.query) {
      for (const key in opt.query) {
        if (Object.prototype.hasOwnProperty.call(opt.query, key)) {
          const qr = opt.query as any;
          query += `${key}=${qr[key]}&`;
        }
      }
      query = `?${query.slice(0, -1)}`;
    }
    if (opt && opt.param) {
      const isMatch = opt.param.match(/[/^[a-zA-Z0-9-_]+$/);
      if (!isMatch) throw new Error('Params invalid string');
      route += `/${opt.param}`;
    }
    return `${route}${query}`;
  }

  protected async post(routeName: TUrl, data: any, opt?: TOption): Promise<APIResponse<any>> {
    const headers = this.parseHeaders(opt?.formData);
    const routePath = this.passRoute(routeName, opt);
    const result = await this.Instace.post(routePath, data, { headers });
    return result;
  }

  protected async get(routeName: TUrl, opt?: TOption): Promise<APIResponse<any>> {
    const headers = this.parseHeaders();
    const routePath = this.passRoute(routeName, opt);
    const result = await this.Instace.get(routePath, { headers });
    return result;
  }

  protected async put(routeName: TUrl, data: any, opt?: TOption): Promise<APIResponse<any>> {
    const headers = this.parseHeaders(opt?.formData);
    const routePath = this.passRoute(routeName, opt);
    const result = await this.Instace.put(routePath, data, { headers });
    return result;
  }

  protected async patch(routeName: TUrl, data: any, opt?: TOption): Promise<APIResponse<any>> {
    const headers = this.parseHeaders();
    const routePath = this.passRoute(routeName, opt);
    const result = await this.Instace.patch(routePath, data, { headers });
    return result;
  }

  protected async destroy(routeName: TUrl, opt?: TOption): Promise<APIResponse<any>> {
    if (!this.config.headers) this.parseHeaders();
    const routePath = this.passRoute(routeName, opt);
    const result = await this.Instace.delete(routePath, this.config);
    return result;
  }
}

export default CallServer;
