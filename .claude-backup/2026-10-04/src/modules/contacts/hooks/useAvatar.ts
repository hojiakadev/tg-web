import { useQuery } from '@tanstack/react-query';
import { get } from 'radash';

import * as Api from '../api';

/** Lazily loads a chat avatar URL. Avatars rarely change, so they are cached for the whole session. */
const useAvatar = (chatId?: string, enabled = true) => {
  const { data, ...args } = useQuery<string>({
    queryKey: ['contacts', 'avatar', chatId],
    queryFn: async () => {
      const { data } = await Api.Avatar({ chatId: chatId! });
      const base64 = get<string>(data, 'base64Avatar', '');
      return get<string>(data, 'urlAvatar', '') || (base64 ? `data:image/jpeg;base64,${base64}` : '');
    },
    enabled: enabled && Boolean(chatId),
    staleTime: Infinity,
    gcTime: 60 * 60_000,
    retry: false
  });

  return { ...args, data: data ?? '' };
};

export default useAvatar;
