import { get } from 'radash';

import { formatPhone, phoneFromChatId } from '@/helpers';
import type * as ContactTypes from '@/modules/contacts/types';

import type * as Types from './types';

const isTextMessage = (src: Types.IApi.LastMessages.Message) =>
  get<string>(src, 'typeMessage') === 'textMessage' ||
  Boolean(get<string>(src, 'textMessage', '')) ||
  Boolean(get<string>(src, 'extendedTextMessage.text', ''));

export const MessageText = (src: Types.IApi.LastMessages.Message) => {
  const text =
    get<string>(src, 'textMessage', '') ||
    get<string>(src, 'extendedTextMessage.text', '') ||
    get<string>(src, 'caption', '');
  return text;
};

export const LastMessage = (src: Types.IApi.LastMessages.Message): Types.IEntity.LastMessage => ({
  id: get<string>(src, 'idMessage', ''),
  text: MessageText(src),
  timestamp: get<number>(src, 'timestamp', 0),
  outgoing: get<string>(src, 'type') === 'outgoing',
  senderName: get<string>(src, 'senderContactName', '') || get<string>(src, 'senderName', ''),
  isText: isTextMessage(src)
});

/** Picks the newest message per chat from the incoming + outgoing journals. */
export const LastMessages = (messages: Types.IApi.LastMessages.Message[]) =>
  messages.reduce<Record<string, Types.IEntity.LastMessage>>((acc, message) => {
    const chatId = get<string>(message, 'chatId', '');
    if (!chatId || !isTextMessage(message)) return acc;

    const next = LastMessage(message);
    if (!acc[chatId] || acc[chatId].timestamp < next.timestamp) acc[chatId] = next;
    return acc;
  }, {});

interface IListSources {
  chats: Types.IApi.List.Chat[];
  contacts: ContactTypes.IApi.List.Contact[];
  messages: Types.IApi.LastMessages.Message[];
  selfChatId?: string;
}

export const List = ({ chats, contacts, messages, selfChatId }: IListSources): Types.IQuery.List => {
  const contactNames = new Map(
    contacts.map(contact => [contact.id, get<string>(contact, 'contactName', '') || get<string>(contact, 'name', '')])
  );
  const lastMessages = LastMessages(messages);

  const knownChatIds = new Set(chats.map(chat => chat.id));
  const recentMessageChatIds = messages
    .filter(message => Boolean(message.chatId) && message.typeMessage === 'textMessage')
    .map(message => message.chatId as string)
    .filter(chatId => !knownChatIds.has(chatId));
  const chatSources = [
    ...chats,
    ...Array.from(new Set(recentMessageChatIds)).map(id => ({ id, type: id.endsWith('@g.us') ? 'group' : 'user' }))
  ];

  const results = chatSources
    .filter(chat => Boolean(chat?.id) && !chat.id.endsWith('@broadcast') && !chat.id.endsWith('@newsletter'))
    .map<Types.IEntity.Chat>(chat => {
      const id = chat.id;
      const isSaved = Boolean(selfChatId) && id === selfChatId;

      return {
        id,
        name: isSaved
          ? 'Saved Messages'
          : contactNames.get(id) || get<string>(chat, 'name', '') || formatPhone(phoneFromChatId(id)) || id,
        type: get<string>(chat, 'type') === 'group' || id.endsWith('@g.us') ? 'group' : 'user',
        archived: get<boolean>(chat, 'archive', false),
        unreadCount: get<number>(chat, 'unreadCount', 0),
        isSaved,
        lastMessage: lastMessages[id]
      };
    })
    // stable sort: chats without a known last message keep the API "activity" order
    .sort((a, b) => (b.lastMessage?.timestamp ?? 0) - (a.lastMessage?.timestamp ?? 0));

  return { results };
};
