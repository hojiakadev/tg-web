import { createFileRoute } from '@tanstack/react-router';

import Chats from '@/pages/Chats';

type ChatsSearch = {
  /** Open conversation. */
  chatId?: string;
};

export const Route = createFileRoute('/_authenticated/')({
  validateSearch: (search: Record<string, unknown>): ChatsSearch => ({
    chatId: typeof search.chatId === 'string' || typeof search.chatId === 'number' ? String(search.chatId) : undefined
  }),
  component: Chats
});
