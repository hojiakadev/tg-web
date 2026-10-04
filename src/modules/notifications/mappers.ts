import { get } from 'radash';

import * as Messages from '@/modules/messages';

import { MESSAGE_WEBHOOKS, STATUS_WEBHOOK } from './constants';
import type * as Types from './types';

/** Converts the webhook payload to the journal shape, so one message mapper serves both. */
const toJournalMessage = (
  body: Types.IApi.Receive.Body,
  direction: 'incoming' | 'outgoing'
): Messages.Types.IApi.Message => {
  const data = body.messageData;
  const file = data?.fileMessageData;

  return {
    type: direction,
    idMessage: body.idMessage,
    timestamp: body.timestamp,
    typeMessage: data?.typeMessage,
    chatId: get<string>(body, 'senderData.chatId', ''),
    textMessage:
      data?.textMessageData?.textMessage ??
      data?.extendedTextMessageData?.text ??
      (data?.pollMessageData?.name ? `📊 ${data.pollMessageData.name}` : undefined),
    caption: file?.caption,
    fileName: file?.fileName,
    downloadUrl: file?.downloadUrl,
    mimeType: file?.mimeType,
    statusMessage: direction === 'outgoing' ? 'sent' : undefined,
    senderId: get<string>(body, 'senderData.sender', ''),
    senderName: get<string>(body, 'senderData.senderName', ''),
    senderContactName: get<string>(body, 'senderData.senderContactName', ''),
    quotedMessage: data?.quotedMessage
  };
};

export const Event = (body: Types.IApi.Receive.Body | undefined): Types.IEntity.Event => {
  const typeWebhook = get<string>(body, 'typeWebhook', '');

  if (body && typeWebhook === STATUS_WEBHOOK) {
    return {
      type: 'status',
      chatId: get<string>(body, 'chatId', ''),
      id: get<string>(body, 'idMessage', ''),
      status: Messages.Mappers.Status(body.status)
    };
  }

  const direction = MESSAGE_WEBHOOKS[typeWebhook];
  if (!body || !direction || get(body, 'messageData.typeMessage') === 'reactionMessage') return { type: 'ignored' };

  const message = Messages.Mappers.Message(toJournalMessage(body, direction));
  if (!message.id || !message.chatId) return { type: 'ignored' };

  return { type: 'message', message, chatName: get<string>(body, 'senderData.chatName', '') };
};
