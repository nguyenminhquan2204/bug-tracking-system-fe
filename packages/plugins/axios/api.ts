import { trimData } from '../../utils';
import { IBodyResponse, ICommonListQuery, IGetListResponse } from '../../utils/interfaces';
import { AxiosInstance } from 'axios';

interface IServiceOption {
  baseUrl?: string;
}

export class ApiService {
  client: AxiosInstance;
  _baseUrl: string;

  constructor(params: IServiceOption, axios: AxiosInstance) {
    this.client = axios;
    this._baseUrl = params.baseUrl ?? '';
  }

  // Implemented as getter so that subclass can override
  get baseUrl() {
    return this._baseUrl;
  }

  useClient(axios: AxiosInstance): void {
    this.client = axios;
  }

  beforeCreate<P>(params: P): P {
    trimData(params);
    return params;
  }

  beforeUpdate<P>(params: P): P {
    trimData(params);
    return params;
  }

  _getList<T>(
    queryString: ICommonListQuery,
  ): Promise<IBodyResponse<IGetListResponse<T>>> {
    return this.client.get(`${this.baseUrl}`, {
      params: queryString,
    });
  }

  _getDetail<R>(id: number | string): Promise<R> {
    return this.client.get<R, R>(this.baseUrl + '/' + id);
  }

  _create<P, R>(params: P): Promise<R> {
    params = this.beforeCreate<P>(params);
    return this.client.post(this.baseUrl, params);
  }

  _update<P, R>(id: number | string, params: P): Promise<R> {
    params = this.beforeUpdate<P>(params);
    return this.client.patch(this.baseUrl + '/' + id, params);
  }

  _put<P, R>(id: number | string, params: P): Promise<R> {
    params = this.beforeUpdate<P>(params);
    return this.client.put(this.baseUrl + '/' + id, params);
  }

  _delete<R>(id: number | string): Promise<R> {
    return this.client.delete<R, R>(this.baseUrl + '/' + id);
  }
}
