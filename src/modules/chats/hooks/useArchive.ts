import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiError } from '@/common/utils';

import * as Api from '../api';
import { QUERY_KEYS } from '../constants';

const useArchive = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, string>({
    mutationFn: chatId => Api.Archive({ chatId }),
    onSuccess: () => {
      toast.success('Chat archived');
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list });
    },
    onError: error => {
      toast.error(getApiError(error).message || 'Could not archive the chat');
    }
  });
};

export default useArchive;
