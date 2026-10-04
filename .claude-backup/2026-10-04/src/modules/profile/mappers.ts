import { get } from 'radash';

import { formatPhone } from '@/helpers';
import type * as ContactTypes from '@/modules/contacts/types';

import type * as Types from './types';

export const Profile = (
  settings: Types.IApi.Settings.Response,
  info?: ContactTypes.IApi.Info.Response
): Types.IEntity.Profile => {
  const phone = get<string>(settings, 'phone', '');
  const base64 = get<string>(settings, 'base64Avatar', '');

  return {
    chatId: phone ? `${phone}@c.us` : '',
    phone,
    name: get<string>(info, 'name', '') || get<string>(info, 'contactName', '') || formatPhone(phone) || 'My account',
    bio: get<string>(info, 'description', ''),
    avatar:
      get<string>(settings, 'avatar', '') ||
      get<string>(info, 'avatar', '') ||
      (base64 ? `data:image/jpeg;base64,${base64}` : ''),
    state: get<string>(settings, 'stateInstance', '')
  };
};
