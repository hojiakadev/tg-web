import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiError } from '@/common/utils';

import * as Api from '../api';
import { QUERY_KEYS } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';

interface IVariables {
  file: File;
  caption?: string;
  quoted?: Types.IEntity.Message;
}

/** Uploads a file (photo, video, audio or document) with an optional caption. */
const useSendFile = (chatId: string) => {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.list(chatId);

  return useMutation<Types.IEntity.Message, unknown, IVariables>({
    mutationFn: async ({ file, caption = '', quoted }) => {
      const pending = Mappers.Outgoing(chatId, `pending-${Date.now()}`, { text: caption, quoted, file });
      queryClient.setQueryData<Types.IQuery.List>(queryKey, list => Mappers.Upsert(list, pending));

      try {
        const { data } = await Api.SendFile({
          chatId,
          file,
          fileName: file.name,
          caption: caption || undefined,
          quotedMessageId: quoted?.id
        });
        const sent = { ...pending, id: data.idMessage, fileUrl: data.urlFile || pending.fileUrl, status: 'sent' as const };
        queryClient.setQueryData<Types.IQuery.List>(queryKey, list =>
          Mappers.Upsert({ results: (list?.results ?? []).filter(item => item.id !== pending.id) }, sent)
        );
        return sent;
      } catch (error) {
        queryClient.setQueryData<Types.IQuery.List>(queryKey, list => Mappers.UpdateStatus(list, pending.id, 'failed'));
        throw error;
      }
    },
    onError: error => {
      toast.error(getApiError(error).message || 'File was not sent');
    }
  });
};

export default useSendFile;
