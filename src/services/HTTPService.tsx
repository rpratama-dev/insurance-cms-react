import CallServer, { APIResponseData, TUrl } from './CallServer';

type TQuery = {
  [key: string]: string | number | boolean;
};

type TQueryIndex = {
  page: number;
  perPage: number;
  columnOrder?: string;
  orderBy?: string;
  keyword?: string;
  isPagination?: boolean;
  isActive?: boolean;
};

class HTTPService extends CallServer {
  public routeTarget: TUrl;

  constructor(routeTarget: TUrl) {
    super('insuranceApi');
    this.routeTarget = routeTarget;
  }

  async index(queries: TQueryIndex): Promise<APIResponseData<any>> {
    const { columnOrder, orderBy, page, perPage, ...other } = queries;
    const qr: TQueryIndex = { page, perPage, columnOrder, orderBy };
    if (other.keyword) qr.keyword = other.keyword;
    if (typeof other.isActive === 'boolean') qr.isActive = other.isActive;
    if (typeof other.isPagination === 'boolean') qr.isPagination = other.isPagination;

    const { data: response } = await this.get(this.routeTarget, { query: qr });
    if (response.status !== 'success') throw new Error('Response error: HTTPService.index');
    return response;
  }

  async show(itemID: string | number, query?: TQuery) {
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

  async remove(itemID: string | number, query?: TQuery) {
    const { data: response } = await this.destroy(this.routeTarget, { query, param: String(itemID) });
    if (response.status !== 'success') throw new Error('Response error: HTTPService.remove');
    return response;
  }
}

export default HTTPService;
