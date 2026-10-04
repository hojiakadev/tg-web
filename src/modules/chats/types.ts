import type * as MessageTypes from '@/modules/messages/types';

export declare namespace IApi {
  export namespace List {
    export interface Chat {
      chatId: string;
      name?: string;
      type?: 'user' | 'bot' | 'group' | 'supergroup' | 'channel' | string;
      phoneNumber?: number;
      username?: string;
    }

    export type Response = Chat[];
  }

  export namespace LastMessages {
    export interface Params {
      minutes?: number;
    }

    export type Response = MessageTypes.IApi.Message[];
  }

  export namespace Read {
    export interface Request {
      chatId: string;
    }

    export interface Response {
      setRead?: boolean;
    }
  }

  export namespace Group {
    export interface Request {
      chatId: string;
    }

    export interface Response {
      chatId?: string;
      subject?: string;
      description?: string;
      size?: number;
    }
  }

  export namespace Archive {
    export interface Request {
      chatId: string;
    }
  }
}

export declare namespace IEntity {
  export type Type = 'user' | 'bot' | 'group' | 'channel';

  export interface Chat {
    id: string;
    name: string;
    type: Type;
    username: string;
    phone: string;
    /** The account's own chat, shown as "Saved Messages". */
    isSaved: boolean;
    unreadCount: number;
    lastMessage?: MessageTypes.IEntity.Message;
  }

  export interface Group {
    id: string;
    name: string;
    description: string;
    /** Number of participants. */
    size: number;
  }

  /** Newest known message per chat id. */
  export type Previews = Record<string, MessageTypes.IEntity.Message>;

  /** Unread counters per chat id, collected from live notifications. */
  export type Unread = Record<string, number>;
}

export declare namespace IQuery {
  export interface List {
    results: IEntity.Chat[];
  }
}

export declare namespace IForm {
  export type Mode = 'phone' | 'chatId';

  export interface Create {
    mode: Mode;
    value: string;
  }
}
