import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMemo, useRef, useState } from 'react';

import NewChatModal from '@/components/NewChatModal';
import Panel from '@/components/Panel';
import SearchBar from '@/components/SearchBar';
import { getApiError } from '@/common/utils';
import { isOverlayOpen } from '@/helpers';
import Main from '@/layouts/Main';
import * as Chats from '@/modules/chats';
import * as Contacts from '@/modules/contacts';
import * as Messages from '@/modules/messages';
import * as Profile from '@/modules/profile';

import ComposeMenu from './components/compose/ComposeMenu';
import MainMenu from './components/menu/MainMenu';
import Conversation from './components/conversation';
import { ChatList } from './components/list';

const matches = (chat: Chats.Types.IEntity.Chat, query: string) =>
  [chat.name, chat.username, chat.phone, chat.id, chat.lastMessage ? Messages.Mappers.Preview(chat.lastMessage) : '']
    .join(' ')
    .toLowerCase()
    .includes(query);

function ChatsPage() {
  const navigate = useNavigate();
  const { chatId } = useSearch({ from: '/_authenticated/' });

  const [search, setSearch] = useState('');
  const [newChatOpened, newChat] = useDisclosure(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: profile } = Profile.Hooks.useProfile();
  const { data: chats, isLoading, error } = Chats.Hooks.useList({ selfChatId: profile?.chatId });
  const { data: contacts } = Contacts.Hooks.useList();

  const openChat = (id?: string) => navigate({ to: '/', search: id ? { chatId: id } : {} });

  const visibleChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? chats.filter(chat => matches(chat, query)) : chats;
  }, [chats, search]);

  /** Opens the chat `step` positions above (-1) or below (+1) the current one. */
  const openSibling = (step: number) => {
    if (isOverlayOpen() || !visibleChats.length) return;
    const index = visibleChats.findIndex(chat => chat.id === chatId);
    const next = index === -1 ? (step > 0 ? 0 : visibleChats.length - 1) : index + step;
    const target = visibleChats[Math.min(Math.max(next, 0), visibleChats.length - 1)];
    if (target) openChat(target.id);
  };

  // Telegram shortcuts of the chat list (Escape for the open chat lives in Conversation)
  useHotkeys(
    [
      ['mod+K', () => searchRef.current?.focus()],
      ['alt+ArrowUp', () => openSibling(-1)],
      ['alt+ArrowDown', () => openSibling(1)],
      ['mod+0', () => profile?.chatId && openChat(profile.chatId)]
    ],
    []
  );

  // a chat opened by id (new chat, contact) may not be in the list yet
  const activeChat = useMemo<Chats.Types.IEntity.Chat | undefined>(() => {
    if (!chatId) return undefined;

    const isSaved = chatId === profile?.chatId;
    return (
      chats.find(chat => chat.id === chatId) ?? {
        id: chatId,
        name: isSaved
          ? Chats.Constants.SAVED_MESSAGES
          : (contacts.find(contact => contact.id === chatId)?.name ?? chatId),
        type: Chats.Mappers.TypeFromId(chatId),
        username: '',
        phone: '',
        isSaved,
        unreadCount: 0
      }
    );
  }, [chatId, chats, contacts, profile?.chatId]);

  return (
    <Main
      hasContent={Boolean(activeChat)}
      navbar={
        <Panel
          header={
            <>
              <MainMenu profile={profile} />
              <SearchBar
                ref={searchRef}
                value={search}
                onChange={setSearch}
                onEnter={() => visibleChats[0] && openChat(visibleChats[0].id)}
              />
            </>
          }
          fab={<ComposeMenu onNewPrivateChat={newChat.open} />}
        >
          <ChatList
            chats={visibleChats}
            activeId={chatId}
            isLoading={isLoading}
            error={error ? getApiError(error).message || 'Could not load chats' : undefined}
            emptyText={search ? 'No chats found' : 'No chats yet'}
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
