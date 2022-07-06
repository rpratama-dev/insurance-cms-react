import CallServer, { APIResponseData, ResponsePagination, TUrl } from './CallServer';

type TQuery = {
  [key: string]: string | number | boolean;
};

export type TQueryIndex = {
  page?: number;
  perPage?: number;
  keyword?: string;
  orderBy?: string;
  sortBy?: 'asc' | 'desc';
  isActive?: boolean;
  isPagination?: boolean;
} & {
  [key: string]: number | boolean | string | undefined;
};

class HTTPService extends CallServer {
  public routeTarget: TUrl;

  constructor(routeTarget: TUrl) {
    super('insuranceApi');
    this.routeTarget = routeTarget;
  }

  async index(queries: TQueryIndex): Promise<ResponsePagination<any> | APIResponseData<any>> {
    const { data: response } = await this.get(this.routeTarget, { query: queries });
    if (response.status !== 'success') throw new Error('Response error: HTTPService.index');
    return response;
  }

  async show(itemID: string | number, query?: TQuery): Promise<APIResponseData<any>> {
    const { data: response } = await this.get(this.routeTarget, { query, param: String(itemID) });
    if (response.status !== 'success') throw new Error('Response error: HTTPService.show');
    return response;
  }

  async store(payload: any, query?: TQuery) {
    const { data: response } = await this.post(this.routeTarget, payload, { query });
    if (response.status !== 'success') throw new Error('Response error: HTTPService.store');
    return response;
  }

  async storeFormData(payload: FormData, query?: TQuery) {
    const { data: response } = await this.post(this.routeTarget, payload, { query, formData: true });
    if (response.status !== 'success') throw new Error('Response error: HTTPService.storeFormData');
    return response;
  }

  async update(payload: any, itemID: string | number, query?: TQuery) {
    const { data: response } = await this.put(this.routeTarget, payload, { query, param: String(itemID) });
    if (response.status !== 'success') throw new Error('Response error: HTTPService.update');
    return response;
  }

  async updatePatch(payload: any, itemID: string | number, query?: TQuery) {
    const { data: response } = await this.patch(this.routeTarget, payload, { query, param: String(itemID) });
    if (response.status !== 'success') throw new Error('Response error: HTTPService.updatePatch');
    return response;
  }

  async remove(itemID: string | number, query?: TQuery) {
    const { data: response } = await this.destroy(this.routeTarget, { query, param: String(itemID) });
    if (response.status !== 'success') throw new Error('Response error: HTTPService.remove');
    return response;
  }
}

export default HTTPService;
