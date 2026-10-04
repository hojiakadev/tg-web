import { get } from 'radash';

import { formatPhone } from '@/helpers';
import type * as ContactTypes from '@/modules/contacts/types';
import * as Messages from '@/modules/messages';

import { SAVED_MESSAGES, TYPE_BY_API } from './constants';
import type * as Types from './types';

/** Telegram ids: users are positive numbers, groups and channels are negative. */
export const TypeFromId = (chatId: string): Types.IEntity.Type => (chatId.startsWith('-') ? 'group' : 'user');

/** Keeps the newer of two previews. */
export const UpsertPreview = (
  previews: Types.IEntity.Previews = {},
  message: Messages.Types.IEntity.Message
): Types.IEntity.Previews => {
  const current = previews[message.chatId];
  if (current && current.timestamp > message.timestamp) return previews;
  return { ...previews, [message.chatId]: message };
};

export const Previews = (src: unknown[]): Types.IEntity.Previews =>
  src
    .filter(item => get<string>(item, 'typeMessage') !== 'reactionMessage')
    .map(item => Messages.Mappers.Message(item as Messages.Types.IApi.Message))
    .filter(message => Boolean(message.chatId))
    .reduce<Types.IEntity.Previews>(UpsertPreview, {});

interface IListSources {
  chats: Types.IApi.List.Chat[];
  contacts: ContactTypes.IEntity.Contact[];
  previews: Types.IEntity.Previews;
  unread: Types.IEntity.Unread;
  selfChatId?: string;
}

export const List = ({ chats, contacts, previews, unread, selfChatId }: IListSources): Types.IQuery.List => {
  const contactNames = new Map(contacts.map(contact => [contact.id, contact.name]));
  const knownIds = new Set(chats.map(chat => String(get(chat, 'chatId', ''))));

  // chats that only appear in the journals (e.g. a brand-new conversation) are listed too;
  // in a private chat the incoming sender is the chat partner, group titles are resolved lazily
  const discovered = Object.values(previews)
    .filter(message => !knownIds.has(message.chatId))
    .map<Types.IApi.List.Chat>(message => ({
      chatId: message.chatId,
      name: TypeFromId(message.chatId) === 'user' && message.direction === 'incoming' ? message.senderName : ''
    }));

  const results = [...chats, ...discovered]
    .map<Types.IEntity.Chat>(chat => {
      const id = String(get(chat, 'chatId', ''));
      const phone = formatPhone(get<number>(chat, 'phoneNumber', 0));
      const username = get<string>(chat, 'username', '');
      const isSaved = Boolean(selfChatId) && id === selfChatId;

      return {
        id,
        name: isSaved
          ? SAVED_MESSAGES
          : contactNames.get(id) || get<string>(chat, 'name', '') || id,
        type: TYPE_BY_API[get<string>(chat, 'type', '')] ?? TypeFromId(id),
        username,
        phone,
        isSaved,
        unreadCount: unread[id] ?? 0,
        lastMessage: previews[id]
      };
    })
    .filter(chat => Boolean(chat.id))
    // stable sort: chats without a known recent message keep the API order
    .sort((a, b) => (b.lastMessage?.timestamp ?? 0) - (a.lastMessage?.timestamp ?? 0));

  return { results };
};

/** The API knew no name for the chat, so its id is shown until the real title is fetched. */
export const IsUntitled = (chat: Pick<Types.IEntity.Chat, 'id' | 'name'>) => chat.name === chat.id;

export const Group = (src: Types.IApi.Group.Response, chatId: string): Types.IEntity.Group => ({
  id: String(get(src, 'chatId', chatId)),
  name: get<string>(src, 'subject', '') || chatId,
  description: get<string>(src, 'description', ''),
  size: get<number>(src, 'size', 0)
});
