export declare namespace IApi {
  namespace SendMessage {
    interface Request {
      chatId: string;
      message: string;
      quotedMessageId?: string;
    }

    interface Response {
      idMessage: string;
    }

    interface Error {
      code?: number;
      error?: string;
      message?: string;
    }
  }

  namespace GetChatHistory {
    interface Request {
      chatId: string;
      count: number;
    }

    interface Message {
      type?: 'incoming' | 'outgoing' | string;
      idMessage?: string;
      timestamp?: number;
      typeMessage?: string;
      chatId?: string;
      textMessage?: string;
      statusMessage?: string;
      quotedMessage?: QuotedMessage;
    }
  }

  namespace ReceiveNotification {
    interface Response {
      receiptId: number;
      body: NotificationBody;
    }
  }

  namespace DeleteNotification {
    interface Response {
      result: boolean;
    }

    type ReceiptId = number;
  }

  interface NotificationBody {
    typeWebhook?: string;
    messageData?: {
      typeMessage?: string;
      textMessageData?: {
        textMessage?: string;
        quotedMessage?: QuotedMessage;
      };
    };
    senderData?: {
      chatId?: string;
      sender?: string;
      senderName?: string;
      senderPhoneNumber?: number;
    };
    chatId?: string;
    typeMessage?: string;
    textMessage?: string;
    idMessage?: string;
    timestamp?: number;
  }

  interface QuotedMessage {
    stanzaId?: string;
    textMessage?: string;
    textMessageData?: {
      textMessage?: string;
    };
  }
}
