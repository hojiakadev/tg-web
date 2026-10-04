import { get } from 'radash';

import { formatPhone } from '@/helpers';

import type * as Types from './types';

const displayName = (src: unknown) =>
  get<string>(src, 'contactName', '') ||
  get<string>(src, 'name', '') ||
  get<string>(src, 'username', '') ||
  formatPhone(get<number>(src, 'phoneNumber', 0));

export const Contact = (src: Types.IApi.List.Contact): Types.IEntity.Contact => {
  const id = String(get(src, 'chatId', ''));

  return {
    id,
    name: displayName(src) || id,
    username: get<string>(src, 'username', ''),
    phone: formatPhone(get<number>(src, 'phoneNumber', 0))
  };
};

export const List = (src: unknown): Types.IQuery.List => ({
  results: (Array.isArray(src) ? src : [])
    .map(Contact)
    .filter(contact => Boolean(contact.id))
    .sort((a, b) => a.name.localeCompare(b.name))
});

export const Info = (src: Types.IApi.Single.Response, chatId: string): Types.IEntity.Info => ({
  id: String(get(src, 'chatId', chatId)),
  name: displayName(src) || chatId,
  username: get<string>(src, 'username', ''),
  phone: formatPhone(get<number>(src, 'phoneNumber', 0)),
  bio: get<string>(src, 'description', ''),
  avatar: get<string>(src, 'avatar', ''),
  lastSeen: get<number>(src, 'lastSeen', 0),
  isBot: get<string>(src, 'chatType') === 'bot',
  isPremium: get<boolean>(src, 'isPremium', false),
  isVerified: get<boolean>(src, 'isVerified', false)
});

export const Account = (src: Types.IApi.Check.Response): Types.IEntity.Account => ({
  exists: get<boolean>(src, 'exist', false) && Boolean(get(src, 'chatId')),
  chatId: String(get(src, 'chatId', ''))
});
