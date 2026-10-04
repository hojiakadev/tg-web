/** Green-API rate limits (requests per second, per instance). */
export const AVATAR_RATE_LIMIT = 10;
export const INFO_RATE_LIMIT = 5;

export const QUERY_KEYS = {
  list: ['contacts', 'list'] as const,
  single: (chatId: string) => ['contacts', 'single', chatId] as const,
  avatar: (chatId: string) => ['contacts', 'avatar', chatId] as const
};
