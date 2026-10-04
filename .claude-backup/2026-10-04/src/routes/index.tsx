import { createFileRoute } from '@tanstack/react-router';

import App from '@/App';

type ChatsSearch = {
  chatId?: string;
};

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): ChatsSearch => ({
    chatId: typeof search.chatId === 'string' && search.chatId ? search.chatId : undefined
  }),
  component: App
});
