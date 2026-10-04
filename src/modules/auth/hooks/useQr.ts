import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import { QR_REFRESH_INTERVAL, QUERY_KEYS } from '../constants';
import * as Mappers from '../mappers';

/** QR code for "Log in by QR". Refreshed every 5 s because codes expire quickly. */
const useQr = (enabled = true) => {
  const { data, ...args } = useQuery({
    queryKey: QUERY_KEYS.qr,
    queryFn: async () => {
      const { data } = await Api.Qr();
      return Mappers.Qr(data);
    },
    enabled,
    refetchInterval: query => (query.state.data?.status === 'authorized' ? false : QR_REFRESH_INTERVAL),
    retry: 1
  });

  return { ...args, data };
};

export default useQr;
