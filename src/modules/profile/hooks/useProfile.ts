import { useQuery } from '@tanstack/react-query';

import * as Contacts from '@/modules/contacts';

import * as Api from '../api';
import { QUERY_KEYS } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';

/** Current account: settings + own Telegram profile (name, bio). */
const useProfile = () => {
  const { data, ...args } = useQuery<Types.IEntity.Profile>({
    queryKey: QUERY_KEYS.me,
    queryFn: async () => {
      const { data: settings } = await Api.Settings();
      const chatId = String(settings.chatId ?? '');
      const info = chatId
        ? await Contacts.Api.Single({ chatId })
            .then(({ data }) => Contacts.Mappers.Info(data, chatId))
            .catch(() => undefined)
        : undefined;

      return Mappers.Profile(settings, info);
    },
    staleTime: 10 * 60_000
  });

  return { ...args, data };
};

export default useProfile;
