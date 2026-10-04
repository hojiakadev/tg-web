import type * as Types from './types';

/** How far back (minutes) the journals are read to build chat previews — 7 days. */
export const PREVIEW_WINDOW = 7 * 24 * 60;

/** Fallback refresh of the chat list when push notifications are disabled on the instance. */
export const REFETCH_INTERVAL = 60_000;

/** Green-API rate limit for `getGroupData` (requests per second). */
export const GROUP_RATE_LIMIT = 5;

export const QUERY_KEYS = {
  list: ['chats', 'list'] as const,
  group: (chatId: string) => ['chats', 'group', chatId] as const,
  previews: ['chats', 'previews'] as const,
  unread: ['chats', 'unread'] as const
};

export const TYPE_BY_API: Record<string, Types.IEntity.Type> = {
  user: 'user',
  bot: 'bot',
  group: 'group',
  supergroup: 'group',
  channel: 'channel'
};

export const TYPE_LABELS: Record<Types.IEntity.Type, string> = {
  user: '',
  bot: 'bot',
  group: 'group',
  channel: 'channel'
};

export const SAVED_MESSAGES = 'Saved Messages';
