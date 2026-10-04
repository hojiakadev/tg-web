import { useQuery } from '@tanstack/react-query';

import * as ContactsApi from '@/modules/contacts/api';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

const useProfile = () => {
  const { data, ...args } = useQuery<Types.IEntity.Profile>({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const { data: settings } = await Api.Settings();
      const info = settings.phone
        ? await ContactsApi.Info({ chatId: `${settings.phone}@c.us` })
            .then(({ data }) => data)
            .catch(() => undefined)
        : undefined;

      return Mappers.Profile(settings, info);
    },
    staleTime: 10 * 60_000
  });

  return { ...args, data };
};

export default useProfile;
