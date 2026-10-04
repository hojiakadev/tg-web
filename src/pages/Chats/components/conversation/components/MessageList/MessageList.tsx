import { Loader } from '@mantine/core';
import cx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { dayKey, formatDayLabel } from '@/helpers';
import * as Messages from '@/modules/messages';

import Message from '../Message/Message';
import classes from './MessageList.module.scss';

type IProps = {
  messages: Messages.Types.IEntity.Message[];
  isLoading: boolean;
  error?: string;
  /** Group chats show the sender name above incoming runs. */
  showSenders: boolean;
  /** Message picked for a reply — highlighted and scrolled into view. */
  highlightedId?: string;
  onReply: (message: Messages.Types.IEntity.Message) => void;
};

/** Bubbles closer than this (same sender) are drawn as one run. */
const RUN_GAP_SECONDS = 5 * 60;
/** Distance from the bottom (px) still considered "at the bottom". */
const BOTTOM_THRESHOLD = 120;

const isSameRun = (a?: Messages.Types.IEntity.Message, b?: Messages.Types.IEntity.Message) => {
  if (!a || !b) return false;

  return (
    a.direction === b.direction &&
    a.senderId === b.senderId &&
    dayKey(a.timestamp) === dayKey(b.timestamp) &&
    Math.abs(b.timestamp - a.timestamp) < RUN_GAP_SECONDS
  );
};

/** Splits the history into calendar days (each day gets its own sticky date). */
const groupByDay = (messages: Messages.Types.IEntity.Message[]) =>
  messages.reduce<{ key: string; messages: Messages.Types.IEntity.Message[] }[]>((days, message) => {
    const key = dayKey(message.timestamp);
    const last = days.at(-1);
    if (last?.key === key) last.messages.push(message);
    else days.push({ key, messages: [message] });
    return days;
  }, []);

const MessageList = ({ messages, isLoading, error, showSenders, highlightedId, onReply }: IProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const days = useMemo(() => groupByDay(messages), [messages]);

  const textById = useMemo(
    () => new Map(messages.map(message => [message.id, Messages.Mappers.Preview(message)])),
    [messages]
  );

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    const area = scrollRef.current;
    area?.scrollTo({ top: area.scrollHeight, behavior });
  };

  // keep the view pinned to the newest message unless the user scrolled up
  useLayoutEffect(() => {
    if (stickToBottom.current) scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const area = scrollRef.current;
    if (!area) return undefined;

    const onScroll = () => {
      const atBottom = area.scrollHeight - area.scrollTop - area.clientHeight < BOTTOM_THRESHOLD;
      stickToBottom.current = atBottom;
      setShowScrollDown(!atBottom);
    };

    // media loading after the first paint grows the list — stay pinned to the bottom meanwhile
    const resizeObserver = new ResizeObserver(() => {
      if (stickToBottom.current) scrollToBottom();
    });
    if (listRef.current) resizeObserver.observe(listRef.current);

    area.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      area.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!highlightedId) return;
    scrollRef.current
      ?.querySelector(`[data-message-id="${CSS.escape(highlightedId)}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [highlightedId]);

  return (
    <div className={classes.wrapper}>
      <div ref={scrollRef} className={classes.scroll}>
        <div ref={listRef} className={classes.list}>
          {isLoading && !messages.length && (
            <div className={classes.notice}>
              <Loader size="sm" color="white" />
            </div>
          )}

          {!isLoading && !messages.length && (
            <div className={cx(classes.notice, classes.empty)}>
              <strong>{error ? 'Could not load messages' : 'No messages here yet...'}</strong>
              <span>{error || 'Send a message to start the conversation.'}</span>
            </div>
          )}

          {days.map(day => (
            <section key={day.key} className={classes.dayGroup}>
              <div className={classes.day}>
                <span>{formatDayLabel(day.messages[0].timestamp)}</span>
              </div>

              {day.messages.map((message, index) => {
                const firstInRun = !isSameRun(day.messages[index - 1], message);

                return (
                  <div
                    key={message.id}
                    data-message-id={message.id}
                    className={cx(
                      classes.item,
                      firstInRun && classes.runStart,
                      message.id === highlightedId && classes.highlighted
                    )}
                  >
                    <Message
                      message={message}
                      quotedText={message.quotedText || textById.get(message.quotedId)}
                      senderName={
                        showSenders && firstInRun && message.direction === 'incoming' ? message.senderName : undefined
                      }
                      isLast={!isSameRun(message, day.messages[index + 1])}
                      onReply={onReply}
                    />
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </div>

      {showScrollDown && (
        <button
          type="button"
          className={classes.scrollDown}
          aria-label="Scroll to the latest message"
          onClick={() => scrollToBottom('smooth')}
        >
          <ChevronDown size={24} />
        </button>
      )}
    </div>
  );
};

export default MessageList;
