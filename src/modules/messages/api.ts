import type { AxiosPromise } from 'axios';

import { http } from '@/common/services';
import { greenApi, greenMediaApi } from '@/common/utils';
import { toFormData } from '@/helpers';

import type * as Types from './types';

export const History = (payload: Types.IApi.History.Request): AxiosPromise<Types.IApi.History.Response> =>
  http.request.post(greenApi('getChatHistory'), payload);

export const Send = (payload: Types.IApi.Send.Request): AxiosPromise<Types.IApi.Send.Response> =>
  http.request.post(greenApi('sendMessage'), payload);

export const SendFile = (payload: Types.IApi.SendFile.Request): AxiosPromise<Types.IApi.SendFile.Response> =>
  http.request.post(greenMediaApi('sendFileByUpload'), toFormData(payload));
