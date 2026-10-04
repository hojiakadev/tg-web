import { get } from 'radash';

import { KIND_BY_TYPE, MESSAGE_LABELS, STATUS_BY_API } from './constants';
import type * as Types from './types';

export const Status = (src: unknown, fallback: Types.IEntity.Status = 'sent'): Types.IEntity.Status =>
  STATUS_BY_API[String(src ?? '')] ?? fallback;

const Text = (src: Types.IApi.Message) => {
  const text =
    get<string>(src, 'textMessage', '') ||
    get<string>(src, 'extendedTextMessage.text', '') ||
    get<string>(src, 'caption', '');
  if (text) return text;

  const typeMessage = get<string>(src, 'typeMessage', '');
  return KIND_BY_TYPE[typeMessage] ? '' : (MESSAGE_LABELS[typeMessage] ?? 'Unsupported message');
};

export const Message = (src: Types.IApi.Message): Types.IEntity.Message => {
  const direction = get<string>(src, 'type') === 'outgoing' ? 'outgoing' : 'incoming';

  return {
    id: get<string>(src, 'idMessage', ''),
    chatId: get<string>(src, 'chatId', ''),
    direction,
    kind: KIND_BY_TYPE[get<string>(src, 'typeMessage', '')] ?? 'service',
    text: Text(src),
    fileUrl: get<string>(src, 'downloadUrl', ''),
    fileName: get<string>(src, 'fileName', ''),
    mimeType: get<string>(src, 'mimeType', ''),
    timestamp: get<number>(src, 'timestamp', 0),
    status: direction === 'outgoing' ? Status(get(src, 'statusMessage')) : 'read',
    senderId: get<string>(src, 'senderId', ''),
    senderName: get<string>(src, 'senderContactName', '') || get<string>(src, 'senderName', ''),
    quotedId: get<string>(src, 'quotedMessage.stanzaId', ''),
    quotedText: get<string>(src, 'quotedMessage.textMessage', '')
  };
};

/** Short text for chat list previews and reply quotes. */
export const Preview = (message: Types.IEntity.Message) => {
  if (message.kind === 'text' || message.kind === 'service') return message.text;

  const label = MESSAGE_LABELS[`${message.kind}Message`] ?? 'Message';
  return message.kind === 'document' && message.fileName
    ? message.fileName
    : message.text
      ? `${label}, ${message.text}`
      : label;
};

const byTime = (a: Types.IEntity.Message, b: Types.IEntity.Message) => a.timestamp - b.timestamp;

export const List = (src: unknown): Types.IQuery.List => ({
  results: (Array.isArray(src) ? src : [])
    .map(Message)
    .filter(message => Boolean(message.id))
    .sort(byTime)
});

/** Inserts or replaces a message (matched by id), keeping chronological order. */
export const Upsert = (list: Types.IQuery.List | undefined, message: Types.IEntity.Message): Types.IQuery.List => {
  const results = list?.results ?? [];
  const exists = results.some(item => item.id === message.id);

  return {
    results: exists
      ? results.map(item => (item.id === message.id ? { ...item, ...message } : item))
      : [...results, message].sort(byTime)
  };
};

export const UpdateStatus = (
  list: Types.IQuery.List | undefined,
  id: string,
  status: Types.IEntity.Status
): Types.IQuery.List | undefined =>
  list && { results: list.results.map(item => (item.id === id ? { ...item, status } : item)) };

/** Optimistic outgoing message shown until the API echoes it back. */
export const Outgoing = (
  chatId: string,
  id: string,
  values: { text: string; quoted?: Types.IEntity.Message; file?: File }
): Types.IEntity.Message => {
  const mimeType = values.file?.type ?? '';
  const kind: Types.IEntity.Kind = !values.file
    ? 'text'
    : mimeType.startsWith('image/')
      ? 'image'
      : mimeType.startsWith('video/')
        ? 'video'
        : mimeType.startsWith('audio/')
          ? 'audio'
          : 'document';

  return {
    id,
    chatId,
    direction: 'outgoing',
    kind,
    text: values.text,
    fileUrl: values.file ? URL.createObjectURL(values.file) : '',
    fileName: values.file?.name ?? '',
    mimeType,
    timestamp: Math.floor(Date.now() / 1000),
    status: 'pending',
    senderId: '',
    senderName: '',
    quotedId: values.quoted?.id ?? '',
    quotedText: values.quoted ? Preview(values.quoted) : ''
  };
};
