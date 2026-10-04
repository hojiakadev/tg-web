export declare namespace IApi {
  export namespace List {
    export interface Params {
      count?: number;
    }

    export interface Contact {
      chatId: string;
      name?: string;
      contactName?: string;
      type?: string;
      phoneNumber?: number;
      username?: string;
    }

    export type Response = Contact[];
  }

  export namespace Single {
    export interface Request {
      chatId: string;
    }

    export interface Response {
      avatar?: string;
      name?: string;
      contactName?: string;
      chatId?: string;
      chatType?: string;
      lastSeen?: number;
      phoneNumber?: number;
      username?: string;
      isPremium?: boolean;
      isVerified?: boolean;
      description?: string;
    }
  }

  export namespace Avatar {
    export interface Request {
      chatId: string;
    }

    export interface Response {
      urlAvatar?: string;
    }
  }

  export namespace Check {
    /** Exactly one of `phoneNumber` / `username` must be sent. */
    export type Request = { phoneNumber: number; username?: never } | { username: string; phoneNumber?: never };

    export interface Response {
      exist?: boolean;
      chatId?: string;
      username?: string;
      phoneNumber?: number;
    }
  }
}

export declare namespace IEntity {
  export interface Contact {
    id: string;
    name: string;
    username: string;
    phone: string;
  }

  export interface Info {
    id: string;
    name: string;
    username: string;
    phone: string;
    bio: string;
    avatar: string;
    /** Unix time, `0` when hidden by privacy settings. */
    lastSeen: number;
    isBot: boolean;
    isPremium: boolean;
    isVerified: boolean;
  }

  export interface Account {
    exists: boolean;
    chatId: string;
  }
}

export declare namespace IQuery {
  export interface List {
    results: IEntity.Contact[];
  }
}
