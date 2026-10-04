import type { AxiosPromise } from 'axios';

import { http } from '@/common/services';
import { greenApi } from '@/common/utils';

import type * as Types from './types';

export const List = (params: Types.IApi.List.Params = {}): AxiosPromise<Types.IApi.List.Response> =>
  http.request.get(greenApi('getContacts'), { params });

export const Avatar = (payload: Types.IApi.Avatar.Request): AxiosPromise<Types.IApi.Avatar.Response> =>
  http.request.post(greenApi('getAvatar'), payload);

export const Info = (payload: Types.IApi.Info.Request): AxiosPromise<Types.IApi.Info.Response> =>
  http.request.post(greenApi('getContactInfo'), payload);

export const Check = (payload: Types.IApi.Check.Request): AxiosPromise<Types.IApi.Check.Response> =>
  http.request.post(greenApi('checkWhatsapp'), payload);
