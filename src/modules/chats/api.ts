import type { AxiosPromise } from 'axios';

import { http } from '@/common/services';
import { greenApi, rateLimit } from '@/common/utils';

import { GROUP_RATE_LIMIT } from './constants';

import type * as Types from './types';

const groupQueue = rateLimit(GROUP_RATE_LIMIT);

export const List = (): AxiosPromise<Types.IApi.List.Response> => http.request.get(greenApi('getChats'));

export const LastIncoming = (
  params: Types.IApi.LastMessages.Params = {}
): AxiosPromise<Types.IApi.LastMessages.Response> => http.request.get(greenApi('lastIncomingMessages'), { params });

export const LastOutgoing = (
  params: Types.IApi.LastMessages.Params = {}
): AxiosPromise<Types.IApi.LastMessages.Response> => http.request.get(greenApi('lastOutgoingMessages'), { params });

export const Read = (payload: Types.IApi.Read.Request): AxiosPromise<Types.IApi.Read.Response> =>
  http.request.post(greenApi('readChat'), payload);

export const Archive = (payload: Types.IApi.Archive.Request): AxiosPromise<void> =>
  http.request.post(greenApi('archiveChat'), payload);

export const Group = (payload: Types.IApi.Group.Request): AxiosPromise<Types.IApi.Group.Response> =>
  groupQueue(() => http.request.post(greenApi('getGroupData'), payload));
