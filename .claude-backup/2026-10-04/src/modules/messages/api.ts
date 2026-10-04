import type { AxiosPromise } from 'axios';

import { http } from '@/common/services';

import type * as Types from './types';

const API_URL = import.meta.env.VITE_BASE_API_URL as string;
const INSTANCE = import.meta.env.VITE_INSTANCE as string;
const TOKEN = import.meta.env.VITE_QR_TOKEN as string;
const INSTANCE_PATH = INSTANCE.startsWith('waInstance') ? INSTANCE : `waInstance${INSTANCE}`;

const endpoint = (method: string) => `${API_URL}/${INSTANCE_PATH}/${method}/${TOKEN}`;

export const sendMessage = (
  payload: Types.IApi.SendMessage.Request
): AxiosPromise<Types.IApi.SendMessage.Response> =>
  http.request.post<Types.IApi.SendMessage.Response>(endpoint('sendMessage'), payload);

export const getChatHistory = (
  payload: Types.IApi.GetChatHistory.Request
): AxiosPromise<Types.IApi.GetChatHistory.Message[]> =>
  http.request.post<Types.IApi.GetChatHistory.Message[]>(endpoint('getChatHistory'), payload);

export const receiveNotification = (): AxiosPromise<Types.IApi.ReceiveNotification.Response> =>
  http.request.get<Types.IApi.ReceiveNotification.Response>(endpoint('receiveNotification'), {
    params: { receiveTimeout: 5 },
  });

export const deleteNotification = (
  receiptId: Types.IApi.DeleteNotification.ReceiptId
): AxiosPromise<Types.IApi.DeleteNotification.Response> =>
  http.request.delete<Types.IApi.DeleteNotification.Response>(
    `${endpoint('deleteNotification')}/${receiptId}`
  );
