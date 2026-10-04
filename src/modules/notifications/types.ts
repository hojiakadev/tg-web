import type * as MessageTypes from '@/modules/messages/types';

export declare namespace IApi {
  export namespace Receive {
    export interface Params {
      receiveTimeout: number;
    }

    export interface Body {
      typeWebhook?: string;
      timestamp?: number;
      idMessage?: string;
      chatId?: string;
      status?: string;
      senderData?: {
        chatId?: string;
        chatName?: string;
        chatType?: string;
        sender?: string;
        senderName?: string;
        senderContactName?: string;
      };
      messageData?: {
        typeMessage?: string;
        textMessageData?: { textMessage?: string };
        extendedTextMessageData?: { text?: string };
        fileMessageData?: { downloadUrl?: string; caption?: string; fileName?: string; mimeType?: string };
        pollMessageData?: { name?: string };
        quotedMessage?: { stanzaId?: string; textMessage?: string };
      };
    }

    /** `null` when nothing arrived within `receiveTimeout`. */
    export type Response = { receiptId: number; body: Body } | null;
  }

  export namespace Delete {
    export interface Response {
      result?: boolean;
    }
  }
}

export declare namespace IEntity {
  export type Event =
    | { type: 'message'; message: MessageTypes.IEntity.Message; chatName: string }
    | { type: 'status'; chatId: string; id: string; status: MessageTypes.IEntity.Status }
    | { type: 'ignored' };
}
