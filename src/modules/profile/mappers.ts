import { get } from 'radash';

import { formatPhone } from '@/helpers';
import type * as ContactTypes from '@/modules/contacts/types';

import type * as Types from './types';

export const Profile = (
  settings: Types.IApi.Settings.Response,
  info?: ContactTypes.IEntity.Info
): Types.IEntity.Profile => {
  const phone = formatPhone(get<string>(settings, 'phone', ''));
  const username = get<string>(settings, 'username', '') || info?.username || '';

  return {
    chatId: String(get(settings, 'chatId', '')),
    name: info?.name || username || phone || 'My account',
    phone,
    username,
    bio: info?.bio ?? '',
    avatar: get<string>(settings, 'avatar', '') || info?.avatar || '',
    isOnline: get<string>(settings, 'stateInstance') === 'authorized'
  };
};
