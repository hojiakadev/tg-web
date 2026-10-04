import { get } from 'radash';

import type * as Types from './types';

export const Login = (src: Types.IApi.Login.Response): Types.IEntity.Session => ({
  accessToken: get(src, 'accessToken') || get(src, 'token'),
  refreshToken: get(src, 'refreshToken'),
  userId: get(src, 'user.id') ? String(get(src, 'user.id')) : undefined,
  phone: get(src, 'user.phone'),
});