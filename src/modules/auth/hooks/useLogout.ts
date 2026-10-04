import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiError } from '@/common/utils';

import * as Api from '../api';

/** Ends the Telegram session of the instance and clears every cached query. */
const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await Api.Logout();
      if (!data?.isLogout) throw new Error('Telegram did not confirm the logout');
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out');
    },
    onError: error => {
      toast.error(getApiError(error).message || 'Could not log out');
    }
  });
};

export default useLogout;
