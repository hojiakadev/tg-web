import type { AxiosPromise } from 'axios';

import { http } from '@/common/services';
import { greenApi } from '@/common/utils';

import type * as Types from './types';

export const Qr = (): AxiosPromise<Types.IApi.Qr.Response> =>
  http.qrCodeRequest.get(`/qr/${import.meta.env.VITE_QR_TOKEN}`);

export const State = (): AxiosPromise<Types.IApi.State.Response> => http.request.get(greenApi('getStateInstance'));

export const StartAuthorization = (
  payload: Types.IApi.StartAuthorization.Request
): AxiosPromise<Types.IApi.Authorization> => http.request.post(greenApi('startAuthorization'), payload);

export const SendCode = (payload: Types.IApi.SendCode.Request): AxiosPromise<Types.IApi.Authorization> =>
  http.request.post(greenApi('sendAuthorizationCode'), payload);

export const SendPassword = (payload: Types.IApi.SendPassword.Request): AxiosPromise<Types.IApi.Authorization> =>
  http.request.post(greenApi('sendAuthorizationPassword'), payload);

export const Logout = (): AxiosPromise<Types.IApi.Logout.Response> => http.request.get(greenApi('logout'));
