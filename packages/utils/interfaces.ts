/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { HttpStatus, OrderBy, OrderDirection } from './constants';

export interface IBodyResponse<T> extends AxiosResponse {
  success: boolean;
  code: HttpStatus;
  isRequestError?: boolean;
  message: string;
  data: T;
  errors?: IErrorItem[];
  errorCode?: string;
}

export interface IErrorItem {
  errorField: string;
  errorKey: string;
}

export interface IGetListResponse<T> {
  items?: T[];
  totalItems?: number;
  hackathon?: any;
  totalGroup?: any;
}

export interface ICommonListQuery {
  page?: number;
  limit?: number;
  orderBy?: OrderBy | string;
  orderDirection?: OrderDirection;
  search?: string;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
}
