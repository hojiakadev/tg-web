import { useInViewport } from '@mantine/hooks';
import cx from 'clsx';

import Avatar from '@/components/Avatar';
import { formatChatTime } from '@/helpers';
import * as Chats from '@/modules/chats';
import * as Messages from '@/modules/messages';

import MessageStatus from '../conversation/components/Message/MessageStatus';
import classes from './ChatItem.module.scss';

type IProps = {
  chat: Chats.Types.IEntity.Chat;
  active: boolean;
  onClick: () => void;
};

/** Sender prefix of a group preview: "You" or the sender's first name. */
const senderPrefix = (chat: Chats.Types.IEntity.Chat) => {
  const message = chat.lastMessage;
  if (!message || chat.type !== 'group') return '';
  if (message.direction === 'outgoing') return 'You';
  return message.senderName.split(' ')[0];
};

/** Secondary line for chats without a recent message. */
const fallbackLine = (chat: Chats.Types.IEntity.Chat) =>
  chat.username || chat.phone || Chats.Constants.TYPE_LABELS[chat.type];

const ChatItem = ({ chat, active, onClick }: IProps) => {
  const { ref, inViewport } = useInViewport();
  const title = Chats.Hooks.useTitle(chat, inViewport);
  const { lastMessage } = chat;
  const sender = senderPrefix(chat);

  return (
    <button ref={ref} type="button" className={cx(classes.item, active && classes.active)} onClick={onClick}>
      <Avatar chatId={chat.id} name={title} saved={chat.isSaved} />

      <span className={classes.content}>
        <span className={classes.row}>
          <strong className={classes.name}>{title}</strong>
          <span className={classes.meta}>
            {lastMessage?.direction === 'outgoing' && !chat.isSaved && (
              <MessageStatus status={lastMessage.status} className={classes.status} />
            )}
            {formatChatTime(lastMessage?.timestamp)}
          </span>
        </span>

        <span className={classes.row}>
          <span className={classes.preview}>
            {lastMessage ? (
              <>
                {sender && <span className={classes.sender}>{sender}: </span>}
                {Messages.Mappers.Preview(lastMessage)}
              </>
            ) : (
              fallbackLine(chat)
            )}
          </span>
          {chat.unreadCount > 0 && <span className={classes.badge}>{chat.unreadCount}</span>}
        </span>
      </span>
    </button>
  );
};

export default ChatItem;
