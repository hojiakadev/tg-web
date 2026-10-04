import storage from '@/common/services/storage';

import type * as Types from '../types';

export function isAuthenticated() {
  return storage.local.get('isAuthenticated') === true;
}

export function signIn(session: Types.IEntity.Session) {
  storage.local.set('isAuthenticated', true);
  if (session.accessToken) {
    storage.local.set('accessToken', session.accessToken);
  }
}

export function signOut() {
  storage.local.remove('isAuthenticated');
  storage.local.remove('accessToken');
}
