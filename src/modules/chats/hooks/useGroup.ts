import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import { QUERY_KEYS } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';

/** Group / channel details: title, description, member count. */
const useGroup = (chatId: string, enabled = true) => {
  const { data, ...args } = useQuery<Types.IEntity.Group>({
    queryKey: QUERY_KEYS.group(chatId),
    queryFn: async () => {
      const { data } = await Api.Group({ chatId });
      return Mappers.Group(data, chatId);
    },
    staleTime: 10 * 60_000,
    retry: false,
    enabled: enabled && Boolean(chatId)
  });

  return { ...args, data };
};

export default useGroup;
