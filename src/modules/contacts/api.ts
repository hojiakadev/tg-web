import type { AxiosPromise } from 'axios';

import { http } from '@/common/services';
import { greenApi, rateLimit } from '@/common/utils';

import { AVATAR_RATE_LIMIT, INFO_RATE_LIMIT } from './constants';
import type * as Types from './types';

const avatarQueue = rateLimit(AVATAR_RATE_LIMIT);
const infoQueue = rateLimit(INFO_RATE_LIMIT);

export const List = (params: Types.IApi.List.Params = {}): AxiosPromise<Types.IApi.List.Response> =>
  http.request.get(greenApi('getContacts'), { params });

export const Single = (payload: Types.IApi.Single.Request): AxiosPromise<Types.IApi.Single.Response> =>
  infoQueue(() => http.request.post(greenApi('getContactInfo'), payload));

export const Avatar = (payload: Types.IApi.Avatar.Request): AxiosPromise<Types.IApi.Avatar.Response> =>
  avatarQueue(() => http.request.post(greenApi('getAvatar'), payload));

export const Check = (payload: Types.IApi.Check.Request): AxiosPromise<Types.IApi.Check.Response> =>
  http.request.post(greenApi('checkAccount'), payload);
