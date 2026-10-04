import { useHotkeys } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import { getApiError } from '@/common/utils';
import { isOverlayOpen } from '@/helpers';
import * as Chats from '@/modules/chats';
import * as Messages from '@/modules/messages';

import Composer from './components/Composer/Composer';
import Header from './components/Header/Header';
import MessageList from './components/MessageList/MessageList';
import classes from './Conversation.module.scss';

type IProps = {
  chat: Chats.Types.IEntity.Chat;
  onBack: () => void;
};

/** Right column: header, history and composer of one chat. Remounted per chat (`key`). */
const Conversation = ({ chat, onBack }: IProps) => {
  const [replyTo, setReplyTo] = useState<Messages.Types.IEntity.Message>();
  const { data: messages, isLoading, error } = Messages.Hooks.useList(chat.id);
  const { mutate: markRead } = Chats.Hooks.useRead();

  const lastIncomingId = messages.findLast(message => message.direction === 'incoming')?.id;

  // opening the chat — and every new incoming message while it is open — marks it read on Telegram
  useEffect(() => {
    markRead(chat.id);
  }, [chat.id, lastIncomingId, markRead]);

  /** Ctrl/⌘ + ↑ / ↓ walks through the messages to pick the one to reply to (Telegram Desktop/Web). */
  const moveReply = (step: number) => {
    if (isOverlayOpen() || !messages.length) return;
    const index = replyTo ? messages.findIndex(message => message.id === replyTo.id) : messages.length;
    const next = index + step;
    if (next >= messages.length) return setReplyTo(undefined);
    setReplyTo(messages[Math.max(next, 0)]);
  };

  // empty tag list: these also work while typing in the composer
  useHotkeys(
    [
      [
        'Escape',
        () => {
          if (isOverlayOpen()) return;
          if (replyTo) setReplyTo(undefined);
          else onBack();
        },
        { preventDefault: false }
      ],
      ['mod+ArrowUp', () => moveReply(-1)],
      ['mod+ArrowDown', () => moveReply(1)]
    ],
    []
  );

  return (
    <section className={classes.conversation}>
      <Header chat={chat} onBack={onBack} />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        error={error ? getApiError(error).message || 'Please try again later' : undefined}
        showSenders={chat.type === 'group'}
        highlightedId={replyTo?.id}
        onReply={setReplyTo}
      />
      <Composer
        chatId={chat.id}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(undefined)}
        onSent={() => setReplyTo(undefined)}
      />
    </section>
  );
};

export default Conversation;
