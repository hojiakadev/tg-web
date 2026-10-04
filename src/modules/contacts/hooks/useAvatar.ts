import { useQuery } from '@tanstack/react-query';
import { get } from 'radash';

import * as Api from '../api';
import { QUERY_KEYS } from '../constants';

/** Avatar URL of a chat. Avatars rarely change, so they are cached for the whole session. */
const useAvatar = (chatId: string, enabled = true) => {
  const { data, ...args } = useQuery<string>({
    queryKey: QUERY_KEYS.avatar(chatId),
    queryFn: async () => {
      const { data } = await Api.Avatar({ chatId });
      return get<string>(data, 'urlAvatar', '');
    },
    enabled: enabled && Boolean(chatId),
    staleTime: Infinity,
    gcTime: 60 * 60_000,
    retry: false
  });

  return { ...args, data: data ?? '' };
};

export default useAvatar;
