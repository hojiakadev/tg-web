import axios from 'axios';

import { http } from '@/common/services';

import type * as Types from './types';

export const Qr = () =>
  http.qrCodeRequest.get<Types.IApi.Qr.Result>(`/qr/${import.meta.env.VITE_QR_TOKEN}`, {
    validateStatus: () => true,
  });

export const Logo = () => axios.get('https://web.telegram.org/k/assets/img/icon_square_192.png?v=jw3mK7G9Ry');

export const Login = ({ phone }: Types.IApi.Login.Request) =>
  http.pureRequest.post<Types.IApi.Login.Response>('/auth/login', { phone });
