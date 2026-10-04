import { useQuery } from '@tanstack/react-query';

import { Qr } from '@/modules/auth/api';

const QR_REFRESH_INTERVAL = 5_000;

export const useQrCode = (enabled: boolean) =>
  useQuery({
    queryKey: ['auth', 'qr'],
    queryFn: async () => {
      const response = await Qr();
      const { data } = response;

      if (response.status !== 200) {
        throw new Error(`QR endpoint returned HTTP ${response.status}. Check the instance and API token.`);
      }

      if (typeof data === 'string') {
        throw new Error('QR endpoint returned an invalid response.');
      }

      if (data.type !== 'qrCode') {
        throw new Error(data.message || `Green-API returned "${data.type}".`);
      }

      if (!data.message) {
        throw new Error('Green-API returned an empty QR code.');
      }

      return `data:image/png;base64,${data.message.replace(/^data:image\/png;base64,/, '')}`;
    },
    enabled,
    refetchInterval: QR_REFRESH_INTERVAL,
    retry: 1,
  });
