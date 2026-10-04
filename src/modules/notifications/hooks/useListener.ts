import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import * as Chats from '@/modules/chats';
import * as Messages from '@/modules/messages';

import * as Api from '../api';
import { RETRY_DELAY } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>(resolve => {
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer);
      resolve();
    });
  });

const applyEvent = (queryClient: QueryClient, event: Types.IEntity.Event, activeChatId?: string) => {
  if (event.type === 'status') {
    queryClient.setQueryData<Messages.Types.IQuery.List>(Messages.Constants.QUERY_KEYS.list(event.chatId), list =>
      Messages.Mappers.UpdateStatus(list, event.id, event.status)
    );
    queryClient.setQueryData<Chats.Types.IEntity.Previews>(Chats.Constants.QUERY_KEYS.previews, previews => {
      const preview = previews?.[event.chatId];
      return preview?.id === event.id ? { ...previews, [event.chatId]: { ...preview, status: event.status } } : previews;
    });
    return;
  }

  if (event.type !== 'message') return;
  const { message } = event;

  queryClient.setQueryData<Messages.Types.IQuery.List>(Messages.Constants.QUERY_KEYS.list(message.chatId), list =>
    list ? Messages.Mappers.Upsert(list, message) : list
  );
  queryClient.setQueryData<Chats.Types.IEntity.Previews>(Chats.Constants.QUERY_KEYS.previews, previews =>
    Chats.Mappers.UpsertPreview(previews, message)
  );

  if (message.direction === 'incoming' && message.chatId !== activeChatId) {
    queryClient.setQueryData<Chats.Types.IEntity.Unread>(Chats.Constants.QUERY_KEYS.unread, unread => ({
      ...unread,
      [message.chatId]: (unread?.[message.chatId] ?? 0) + 1
    }));
  }

  const chats = queryClient.getQueryData<Chats.Types.IApi.List.Response>(Chats.Constants.QUERY_KEYS.list);
  if (chats && !chats.some(chat => String(chat.chatId) === message.chatId)) {
    void queryClient.invalidateQueries({ queryKey: Chats.Constants.QUERY_KEYS.list });
  }
};

/**
 * Long-polls Green-API notifications for the whole app and patches the cached chats and messages.
 * Requires the instance setting "Receive notifications" (incomingWebhook / outgoing webhooks) to be on;
 * without it the lists still refresh on their fallback intervals.
 */
const useListener = (activeChatId?: string) => {
  const queryClient = useQueryClient();
  const activeChatRef = useRef(activeChatId);

  useEffect(() => {
    activeChatRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const listen = async () => {
      while (!signal.aborted) {
        try {
          const { data } = await Api.Receive(signal);
          if (!data?.receiptId) continue;

          applyEvent(queryClient, Mappers.Event(data.body), activeChatRef.current);
          await Api.Delete(data.receiptId);
        } catch {
          if (!signal.aborted) await wait(RETRY_DELAY, signal);
        }
      }
    };

    void listen();
    return () => controller.abort();
  }, [queryClient]);
};

export default useListener;
