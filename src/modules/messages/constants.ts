import type * as Types from './types';

/** How many messages are loaded when a chat is opened. */
export const HISTORY_COUNT = 100;

/** Fallback refresh of an open chat when push notifications are disabled on the instance. */
export const HISTORY_REFETCH_INTERVAL = 15_000;

/** Telegram text message limit. */
export const MESSAGE_MAX_LENGTH = 4096;

export const QUERY_KEYS = {
  all: ['messages'] as const,
  list: (chatId: string) => ['messages', 'list', chatId] as const
};

export const KIND_BY_TYPE: Record<string, Types.IEntity.Kind> = {
  textMessage: 'text',
  extendedTextMessage: 'text',
  quotedMessage: 'text',
  imageMessage: 'image',
  videoMessage: 'video',
  audioMessage: 'audio',
  documentMessage: 'document',
  stickerMessage: 'sticker'
};

/** Preview / bubble text for messages without text of their own. */
export const MESSAGE_LABELS: Record<string, string> = {
  imageMessage: 'Photo',
  videoMessage: 'Video',
  audioMessage: 'Voice message',
  documentMessage: 'File',
  stickerMessage: 'Sticker',
  locationMessage: '📍 Location',
  contactMessage: '👤 Contact',
  pollMessage: '📊 Poll',
  reactionMessage: 'Reaction',
  deletedMessage: 'Message deleted'
};

export const STATUS_BY_API: Record<string, Types.IEntity.Status> = {
  pending: 'pending',
  sent: 'sent',
  delivered: 'sent',
  read: 'read',
  failed: 'failed',
  noAccount: 'failed'
};
