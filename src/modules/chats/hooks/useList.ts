import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import * as Contacts from '@/modules/contacts';

import * as Api from '../api';
import { PREVIEW_WINDOW, QUERY_KEYS, REFETCH_INTERVAL } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';

interface IProps {
  /** Own chat id — rendered as "Saved Messages". */
  selfChatId?: string;
  enabled?: boolean;
}

const emptyChats: Types.IApi.List.Response = [];
const emptyPreviews: Types.IEntity.Previews = {};
const emptyUnread: Types.IEntity.Unread = {};

/**
 * Chat list = `getChats` + newest message per chat (journals) + phone-book names + live unread counters.
 * Each source is cached separately so live notifications can patch previews and counters in place.
 */
const useList = ({ selfChatId, enabled = true }: IProps = {}) => {
  const chats = useQuery<Types.IApi.List.Response>({
    queryKey: QUERY_KEYS.list,
    queryFn: async () => {
      const { data } = await Api.List();
      return Array.isArray(data) ? data : [];
    },
    placeholderData: keepPreviousData,
    refetchInterval: REFETCH_INTERVAL,
    enabled
  });

  const previews = useQuery<Types.IEntity.Previews>({
    queryKey: QUERY_KEYS.previews,
    queryFn: async () => {
      const params = { minutes: PREVIEW_WINDOW };
      const [incoming, outgoing] = await Promise.all([Api.LastIncoming(params), Api.LastOutgoing(params)]);
      return Mappers.Previews([...(incoming.data ?? []), ...(outgoing.data ?? [])]);
    },
    placeholderData: keepPreviousData,
    refetchInterval: REFETCH_INTERVAL,
    enabled
  });

  // client-side state: filled by the notifications listener, never fetched
  const unread = useQuery<Types.IEntity.Unread>({
    queryKey: QUERY_KEYS.unread,
    queryFn: () => emptyUnread,
    initialData: emptyUnread,
    staleTime: Infinity,
    gcTime: Infinity
  });

  const contacts = Contacts.Hooks.useList({ enabled });

  const data = useMemo(
    () =>
      Mappers.List({
        chats: chats.data ?? emptyChats,
        contacts: contacts.data,
        previews: previews.data ?? emptyPreviews,
        unread: unread.data,
        selfChatId
      }).results,
    [chats.data, contacts.data, previews.data, unread.data, selfChatId]
  );

  return {
    data,
    isLoading: chats.isLoading,
    error: chats.error,
    refetch: chats.refetch
  };
};

export default useList;
