import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import { QUERY_KEYS } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';

/** Telegram profile of a user (bio, username, last seen…). Not available for groups. */
const useSingle = (chatId: string, enabled = true) => {
  const { data, ...args } = useQuery<Types.IEntity.Info>({
    queryKey: QUERY_KEYS.single(chatId),
    queryFn: async () => {
      const { data } = await Api.Single({ chatId });
      return Mappers.Info(data, chatId);
    },
    staleTime: 60_000,
    retry: false,
    enabled: enabled && Boolean(chatId)
  });

  return { ...args, data };
};

export default useSingle;
