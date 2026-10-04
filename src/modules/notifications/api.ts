import type { AxiosPromise } from 'axios';

import { http } from '@/common/services';
import { greenApi } from '@/common/utils';

import { RECEIVE_TIMEOUT } from './constants';
import type * as Types from './types';

export const Receive = (signal?: AbortSignal): AxiosPromise<Types.IApi.Receive.Response> =>
  http.request.get(greenApi('receiveNotification'), { params: { receiveTimeout: RECEIVE_TIMEOUT }, signal });

export const Delete = (receiptId: number): AxiosPromise<Types.IApi.Delete.Response> =>
  http.request.delete(`${greenApi('deleteNotification')}/${receiptId}`);
