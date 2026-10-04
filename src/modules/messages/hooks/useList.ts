import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import { HISTORY_COUNT, HISTORY_REFETCH_INTERVAL, QUERY_KEYS } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';

const initialData: Types.IQuery.List = { results: [] };

/** Chat history. Live updates are merged into this cache by the notifications listener. */
const useList = (chatId: string) => {
  const { data = initialData, ...args } = useQuery<Types.IQuery.List>({
    queryKey: QUERY_KEYS.list(chatId),
    queryFn: async () => {
      const { data } = await Api.History({ chatId, count: HISTORY_COUNT });
      return Mappers.List(data);
    },
    refetchInterval: HISTORY_REFETCH_INTERVAL,
    enabled: Boolean(chatId)
  });

  return { ...args, data: data.results };
};

export default useList;
