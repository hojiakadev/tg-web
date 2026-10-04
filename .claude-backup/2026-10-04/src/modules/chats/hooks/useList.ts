import { keepPreviousData, useQuery } from '@tanstack/react-query';

import * as ContactsApi from '@/modules/contacts/api';
import type * as ContactTypes from '@/modules/contacts/types';

import * as Api from '../api';
import { LAST_MESSAGES_WINDOW, REFETCH_INTERVAL } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';

interface IProps {
  /** Own personal chat id — rendered as "Saved Messages". */
  selfChatId?: string;
  enabled?: boolean;
}

const initialData: Types.IQuery.List = { results: [] };

const settled = <T,>(result: PromiseSettledResult<{ data: T }>, fallback: T) =>
  result.status === 'fulfilled' && Array.isArray(result.value.data) ? result.value.data : fallback;

const useList = ({ selfChatId, enabled = true }: IProps = {}) => {
  const { data = initialData, ...args } = useQuery<Types.IQuery.List>({
    queryKey: ['chats', 'list', selfChatId],
    queryFn: async () => {
      const params = { minutes: LAST_MESSAGES_WINDOW };
      const [chats, contacts, incoming, outgoing] = await Promise.allSettled([
        Api.List(),
        ContactsApi.List(),
        Api.LastIncoming(params),
        Api.LastOutgoing(params)
      ]);

      if (chats.status === 'rejected') throw chats.reason;

      return Mappers.List({
        chats: settled<Types.IApi.List.Chat[]>(chats, []),
        contacts: settled<ContactTypes.IApi.List.Contact[]>(contacts, []),
        messages: [
          ...settled<Types.IApi.LastMessages.Message[]>(incoming, []),
          ...settled<Types.IApi.LastMessages.Message[]>(outgoing, [])
        ],
        selfChatId
      });
    },
    placeholderData: keepPreviousData,
    refetchInterval: REFETCH_INTERVAL,
    enabled
  });

  return { ...args, data: data.results };
};

export default useList;
