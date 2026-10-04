import type { AxiosPromise } from 'axios';

import { http } from '@/common/services';
import { greenApi } from '@/common/utils';

import type * as Types from './types';

export const Settings = (): AxiosPromise<Types.IApi.Settings.Response> => http.request.get(greenApi('getWaSettings'));
