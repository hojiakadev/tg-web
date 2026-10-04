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
    code: get(nestedError, 'code') || get(data, 'code') || get(error, 'response.status', '').toString(),
    message:
      get(nestedError, 'message') ||
      get(data, 'errorMessage.0') ||
      get(data, 'message') ||
      get(data, 'description') ||
      (error instanceof Error ? error.message : ''),
    validations: (get(data, 'errorMessage') || []) as string[]
  };
};

export default getApiError;
