export declare namespace IApi {
  export namespace Settings {
    export interface Response {
      avatar?: string;
      phone?: string;
      stateInstance?: string;
      chatId?: string;
      username?: string;
    }
  }
}

export declare namespace IEntity {
  export interface Profile {
    /** Own chat id — also the "Saved Messages" chat. */
    chatId: string;
    name: string;
    phone: string;
    username: string;
    bio: string;
    avatar: string;
    isOnline: boolean;
  }
}
