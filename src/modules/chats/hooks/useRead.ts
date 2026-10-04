import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';
import { QUERY_KEYS } from '../constants';
import type * as Types from '../types';

/** Marks a chat as read on Telegram and clears its local unread counter. */
const useRead = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, string>({
    mutationFn: chatId => Api.Read({ chatId }),
    onMutate: chatId => {
      queryClient.setQueryData<Types.IEntity.Unread>(QUERY_KEYS.unread, unread =>
        unread?.[chatId] ? { ...unread, [chatId]: 0 } : unread
      );
    }
  });
};

export default useRead;
