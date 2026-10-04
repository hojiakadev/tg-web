import { Loader } from '@mantine/core';
import { MessageCircle } from 'lucide-react';

import type * as ChatTypes from '@/modules/chats/types';

import ChatItem from './ChatItem';
import classes from './ChatList.module.scss';

type IProps = {
  chats: ChatTypes.IEntity.Chat[];
  activeId?: string;
  isLoading: boolean;
  error?: string;
  emptyText: string;
  onSelect: (chatId: string) => void;
};

const ChatList = ({ chats, activeId, isLoading, error, emptyText, onSelect }: IProps) => {
  if (isLoading && !chats.length) {
    return (
      <div className={classes.placeholder}>
        <Loader size="sm" color="#3390ec" />
      </div>
    );
  }

  if (!chats.length) {
    return (
      <div className={classes.placeholder}>
        <MessageCircle size={40} />
        <span>{error || emptyText}</span>
      </div>
    );
  }

  return (
    <div className={classes.list}>
      {chats.map(chat => (
        <ChatItem key={chat.id} chat={chat} active={chat.id === activeId} onClick={() => onSelect(chat.id)} />
      ))}
    </div>
  );
};

export default ChatList;
