export declare namespace IApi {
  export namespace Settings {
    export interface Response {
      stateInstance?: string;
      deviceId?: string;
      chatId?: string;
      phone?: string;
      avatar?: string;
      base64Avatar?: string;
    }
  }
}

export declare namespace IEntity {
  export interface Profile {
    /** Personal chat id of the account (`<phone>@c.us`) — also the "Saved Messages" chat. */
    chatId: string;
    name: string;
    phone: string;
    bio: string;
    avatar: string;
    state: string;
  }
}
