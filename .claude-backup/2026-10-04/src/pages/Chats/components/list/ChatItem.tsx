import { CheckCheck } from 'lucide-react';

import Avatar from '@/components/Avatar';
import { formatChatTime } from '@/helpers';
import type * as ChatTypes from '@/modules/chats/types';

import classes from './ChatList.module.scss';

type IProps = {
  chat: ChatTypes.IEntity.Chat;
  active: boolean;
  onClick: () => void;
};

const ChatItem = ({ chat, active, onClick }: IProps) => {
  const { lastMessage } = chat;
  const sender =
    lastMessage && chat.type === 'group'
      ? lastMessage.outgoing
        ? 'You'
        : lastMessage.senderName.split(' ')[0]
      : '';

  return (
    <button
      type="button"
      className={[classes.item, active ? classes.active : ''].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      <Avatar chatId={chat.id} name={chat.name} saved={chat.isSaved} group={chat.type === 'group'} />

      <span className={classes.content}>
        <span className={classes.row}>
          <strong className={classes.name}>{chat.name}</strong>
          <span className={classes.meta}>
            {lastMessage?.outgoing && !chat.isSaved && <CheckCheck size={16} className={classes.read} />}
            {formatChatTime(lastMessage?.timestamp)}
          </span>
        </span>

        <span className={classes.row}>
          <span className={classes.preview}>
            {sender && <span className={classes.sender}>{sender}: </span>}
            {lastMessage?.text ?? (chat.type === 'group' ? 'Group' : '')}
          </span>
          {chat.unreadCount > 0 && <span className={classes.badge}>{chat.unreadCount}</span>}
        </span>
      </span>
    </button>
  );
};

export default ChatItem;
