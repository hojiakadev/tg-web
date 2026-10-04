export declare namespace IApi {
  export namespace List {
    export interface Params {
      count?: number;
    }

    export interface Chat {
      id: string;
      name?: string;
      type?: 'user' | 'group' | string;
      archive?: boolean;
      unreadCount?: number;
    }

    export type Response = Chat[];
  }

  export namespace LastMessages {
    export interface Params {
      minutes?: number;
    }

    export interface Message {
      type?: 'incoming' | 'outgoing' | string;
      idMessage?: string;
      timestamp?: number;
      typeMessage?: string;
      chatId?: string;
      senderId?: string;
      senderName?: string;
      senderContactName?: string;
      textMessage?: string;
      caption?: string;
      fileName?: string;
      extendedTextMessage?: { text?: string };
    }

    export type Response = Message[];
  }
}

export declare namespace IEntity {
  export interface LastMessage {
    id: string;
    text: string;
    timestamp: number;
    outgoing: boolean;
    senderName: string;
    isText: boolean;
  }

  export interface Chat {
    id: string;
    name: string;
    type: 'user' | 'group';
    archived: boolean;
    unreadCount: number;
    isSaved: boolean;
    lastMessage?: LastMessage;
  }
}

export declare namespace IQuery {
  export interface List {
    results: IEntity.Chat[];
  }
}
