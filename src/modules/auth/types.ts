export declare namespace IApi {
  export namespace Qr {
    export interface Response {
      type?: 'qrCode' | 'error' | 'alreadyLogged' | 'already_registered' | string;
      message?: string;
    }
  }

  export namespace State {
    export interface Response {
      stateInstance?: string;
    }
  }

  /** Common answer of the authorization methods. */
  export interface Authorization {
    status?: boolean;
    data?: {
      status?: 'success' | 'fail' | string;
      reason?: string;
      retryAfter?: number;
    };
  }

  export namespace StartAuthorization {
    export interface Request {
      phoneNumber: number;
    }
  }

  export namespace SendCode {
    export interface Request {
      code: string;
    }
  }

  export namespace SendPassword {
    export interface Request {
      password: string;
    }
  }

  export namespace Logout {
    export interface Response {
      isLogout?: boolean;
    }
  }
}

export declare namespace IEntity {
  export type State = 'notAuthorized' | 'authorized' | 'blocked' | 'suspended' | 'starting' | 'pendingPassword';

  export type Qr = { status: 'qr'; image: string } | { status: 'authorized' };

  export interface Authorization {
    success: boolean;
    /** API failure code, e.g. `2fa_required`, `invalid_password`. */
    reason: string;
  }
}

export declare namespace IForm {
  export interface Login {
    countryCode: string;
    phoneNumber: string;
  }

  export interface Code {
    code: string;
  }

  export interface Password {
    password: string;
  }
}
