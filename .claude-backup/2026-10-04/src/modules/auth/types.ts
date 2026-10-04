export declare namespace IApi {
  namespace Qr {
    interface Response {
      type: 'qrCode' | 'error' | 'alreadyLogged' | 'already_registered' | string;
      message: string;
    }

    type Result = Response | string;
  }

  namespace Login {
    interface Request {
      phone: string;
    }

    interface Response {
      accessToken?: string;
      token?: string;
      refreshToken?: string;
      user?: {
        id?: string | number;
        phone?: string;
      };
    }
  }
}

export declare namespace IEntity {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
    phone?: string;
  }
}