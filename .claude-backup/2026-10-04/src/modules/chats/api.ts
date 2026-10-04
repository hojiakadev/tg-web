import type { AxiosPromise } from 'axios';

import { http } from '@/common/services';
import { greenApi } from '@/common/utils';

import type * as Types from './types';

export const List = (params: Types.IApi.List.Params = {}): AxiosPromise<Types.IApi.List.Response> =>
  http.request.get(greenApi('getChats'), { params });

export const LastIncoming = (
  params: Types.IApi.LastMessages.Params = {}
): AxiosPromise<Types.IApi.LastMessages.Response> => http.request.get(greenApi('lastIncomingMessages'), { params });

export const LastOutgoing = (
  params: Types.IApi.LastMessages.Params = {}
): AxiosPromise<Types.IApi.LastMessages.Response> => http.request.get(greenApi('lastOutgoingMessages'), { params });
