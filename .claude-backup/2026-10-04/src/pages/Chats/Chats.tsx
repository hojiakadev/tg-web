import { useNavigate, useSearch } from '@tanstack/react-router';
import { useDisclosure } from '@mantine/hooks';
import { useMemo, useState } from 'react';

import NewChatModal from '@/components/NewChatModal';
import Panel from '@/components/Panel';
import SearchBar from '@/components/SearchBar';
import { getApiError } from '@/common/utils';
import { formatPhone, phoneFromChatId } from '@/helpers';
import Main from '@/layouts/Main';
import * as Chats from '@/modules/chats';
import * as Contacts from '@/modules/contacts';
import * as Profile from '@/modules/profile';

import ComposeMenu from './components/compose/ComposeMenu';
import ChatList from './components/list/ChatList';
import Conversation from './components/conversation/Conversation';
import MainMenu from './components/menu/MainMenu';

function ChatsPage() {
  const navigate = useNavigate();
  const { chatId } = useSearch({ from: '/' });

  const [search, setSearch] = useState('');
  const [newChatOpened, newChat] = useDisclosure(false);

  const { data: profile } = Profile.Hooks.useProfile();
  const { data: chats, isLoading, error } = Chats.Hooks.useList({ selfChatId: profile?.chatId });
  const { data: contacts } = Contacts.Hooks.useList();

  const openChat = (id?: string) => navigate({ to: '/', search: id ? { chatId: id } : {} });

  const visibleChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    return chats.filter(chat => {
      if (!chat.lastMessage?.isText) return false;
      if (query) {
        return `${chat.name} ${chat.lastMessage?.text ?? ''} ${phoneFromChatId(chat.id)}`.toLowerCase().includes(query);
      }
      if (chat.archived) return false;
      return true;
    });
  }, [chats, search]);

  const activeChat = useMemo(() => {
    if (!chatId) return undefined;
    const found = chats.find(chat => chat.id === chatId);
    if (found) return found;

    const contact = contacts.find(item => item.id === chatId);
    const isSaved = chatId === profile?.chatId;
    return {
      id: chatId,
      name: isSaved ? 'Saved Messages' : contact?.name || formatPhone(phoneFromChatId(chatId)) || chatId,
      type: chatId.endsWith('@g.us') ? 'group' : 'user',
      isSaved
    } as const;
  }, [chatId, chats, contacts, profile?.chatId]);

  return (
    <Main
      hasContent={Boolean(activeChat)}
      navbar={
        <Panel
          header={
            <>
              <MainMenu
                profile={profile}
              />
              <SearchBar value={search} onChange={setSearch} />
            </>
          }
          fab={<ComposeMenu onNewPrivateChat={newChat.open} />}
        >
          <ChatList
            chats={visibleChats}
            activeId={chatId}
            isLoading={isLoading}
            error={error ? getApiError(error).message || 'Could not load chats' : undefined}
            emptyText={search ? 'No chats found' : 'No chats in this folder'}
            onSelect={openChat}
          />
        </Panel>
      }
    >
      {activeChat && <Conversation key={activeChat.id} chat={activeChat} onBack={() => openChat()} />}
      <NewChatModal opened={newChatOpened} onClose={newChat.close} onSubmit={openChat} />
    </Main>
  );
}

export default ChatsPage;
