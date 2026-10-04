export declare namespace IApi {
  /** Message as returned by the journals (`getChatHistory`, `lastIncomingMessages`, `lastOutgoingMessages`). */
  export interface Message {
    type?: 'incoming' | 'outgoing' | string;
    idMessage?: string;
    timestamp?: number;
    typeMessage?: string;
    chatId?: string;
    chatType?: string;
    textMessage?: string;
    extendedTextMessage?: { text?: string };
    caption?: string;
    fileName?: string;
    downloadUrl?: string;
    mimeType?: string;
    statusMessage?: string;
    senderId?: string;
    senderName?: string;
    senderContactName?: string;
    quotedMessage?: { stanzaId?: string; textMessage?: string };
  }

  export namespace History {
    export interface Request {
      chatId: string;
      count: number;
    }

    export type Response = Message[];
  }

  export namespace Send {
    export interface Request {
      chatId: string;
      message: string;
      quotedMessageId?: string;
    }

    export interface Response {
      idMessage: string;
    }
  }

  export namespace SendFile {
    export interface Request {
      chatId: string;
      file: File;
      fileName?: string;
      caption?: string;
      quotedMessageId?: string;
    }

    export interface Response {
      idMessage: string;
      urlFile?: string;
    }
  }
}

export declare namespace IEntity {
  export type Direction = 'incoming' | 'outgoing';

  export type Kind = 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'service';

  export type Status = 'pending' | 'sent' | 'read' | 'failed';

  export interface Message {
    id: string;
    chatId: string;
    direction: Direction;
    kind: Kind;
    /** Message text, media caption or a service label (e.g. "📍 Location"). */
    text: string;
    fileUrl: string;
    fileName: string;
    mimeType: string;
    timestamp: number;
    status: Status;
    senderId: string;
    senderName: string;
    quotedId: string;
    quotedText: string;
  }
}

export declare namespace IQuery {
  export interface List {
    results: IEntity.Message[];
  }
}

export declare namespace IForm {
  export interface Create {
    message: string;
  }
}
