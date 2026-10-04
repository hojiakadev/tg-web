import { get } from 'radash';

import { AUTH_ERRORS } from './constants';
import type * as Types from './types';

const STATES: Types.IEntity.State[] = [
  'notAuthorized',
  'authorized',
  'blocked',
  'suspended',
  'starting',
  'pendingPassword'
];

export const State = (src: Types.IApi.State.Response): Types.IEntity.State => {
  const state = get<string>(src, 'stateInstance', '') as Types.IEntity.State;
  return STATES.includes(state) ? state : 'notAuthorized';
};

const LOGGED_IN = ['alreadyLogged', 'already_registered'];

export const Qr = (src: Types.IApi.Qr.Response): Types.IEntity.Qr => {
  const type = get<string>(src, 'type', '');
  const message = get<string>(src, 'message', '');

  if (LOGGED_IN.includes(type)) return { status: 'authorized' };
  if (type !== 'qrCode' || !message) throw new Error(message || 'Unable to load the QR code');

  return { status: 'qr', image: `data:image/png;base64,${message.replace(/^data:image\/png;base64,/, '')}` };
};

export const Authorization = (src: Types.IApi.Authorization): Types.IEntity.Authorization => ({
  success: get<string>(src, 'data.status') === 'success',
  reason: get<string>(src, 'data.reason', '')
});

/** Human readable error of a failed authorization step. */
export const AuthorizationError = (reason: string) => AUTH_ERRORS[reason] ?? (reason || 'Authorization failed');
