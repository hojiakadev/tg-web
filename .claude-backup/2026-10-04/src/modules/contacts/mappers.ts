import { get } from 'radash';

import { formatPhone, phoneFromChatId } from '@/helpers';

import type * as Types from './types';

export const Contact = (src: unknown): Types.IEntity.Contact => {
  const id = get<string>(src, 'id', '');
  const phone = phoneFromChatId(id);
  const name = get<string>(src, 'contactName', '') || get<string>(src, 'name', '') || formatPhone(phone) || id;

  return {
    id,
    name,
    phone,
    type: get<string>(src, 'type') === 'group' || id.endsWith('@g.us') ? 'group' : 'user'
  };
};

export const List = (src: unknown): Types.IQuery.List => ({
  results: (Array.isArray(src) ? src : [])
    .map(Contact)
    .filter(contact => Boolean(contact.id))
    .sort((a, b) => a.name.localeCompare(b.name))
});
