import { get } from 'radash';

interface IError {
  code: string;
  message: string;
  validations: string[];
}

const getApiError = (error: unknown): IError => {
  const data = get(error, 'response.data') || {};
  const nestedError = get(data, 'error');

  return {
    code: get(nestedError, 'code') || get(data, 'code') || '',
    message:
      get(nestedError, 'message') ||
      get(data, 'errorMessage.0') ||
      get(data, 'message') ||
      '',
    validations: (get(data, 'errorMessage') || []) as string[]
  };
};

export default getApiError;
