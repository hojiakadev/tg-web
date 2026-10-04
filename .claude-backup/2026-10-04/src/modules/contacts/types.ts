export declare namespace IApi {
  export namespace List {
    export interface Params {
      group?: boolean;
      count?: number;
    }

    export interface Contact {
      id: string;
      name?: string;
      contactName?: string;
      type?: 'user' | 'group' | string;
    }

    export type Response = Contact[];
  }

  export namespace Avatar {
    export interface Request {
      chatId: string;
    }

    export interface Response {
      urlAvatar?: string;
      available?: boolean;
      base64Avatar?: string;
    }
  }

  export namespace Check {
    /** Exactly one of the two fields must be sent. */
    export type Request = { chatId: string; phoneNumber?: never } | { phoneNumber: number; chatId?: never };

    export interface Response {
      existsWhatsapp?: boolean;
      chatId?: string;
      username?: string;
      phoneNumber?: string;
    }
  }

  export namespace Info {
    export interface Request {
      chatId: string;
    }

    export interface Response {
      avatar?: string;
      name?: string;
      contactName?: string;
      description?: string;
      chatId?: string;
      lastSeen?: number | null;
      isArchive?: boolean;
      isMute?: boolean;
    }
  }
}

export declare namespace IEntity {
  export interface Contact {
    id: string;
    name: string;
    phone: string;
    type: 'user' | 'group';
  }
}

export declare namespace IQuery {
  export interface List {
    results: IEntity.Contact[];
  }
}
