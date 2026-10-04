import { ActionIcon, TextInput } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, CheckCheck, EllipsisVertical, MessageCircle, Paperclip, Phone, Search, Send, Smile, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import Avatar from '@/components/Avatar';
import { formatMessageTime } from '@/helpers';
import type * as ChatTypes from '@/modules/chats/types';
import { deleteNotification, getChatHistory, receiveNotification, sendMessage } from '@/modules/messages';
import type * as MessageTypes from '@/modules/messages/types';

import classes from './Conversation.module.scss';

type UiMessage = {
  id: string;
  text: string;
  incoming: boolean;
  timestamp?: number;
  replyToId?: string;
  replyToText?: string;
};

type IProps = {
  chat: Pick<ChatTypes.IEntity.Chat, 'id' | 'name' | 'type' | 'isSaved'>;
  onBack: () => void;
};

const Conversation = ({ chat, onBack }: IProps) => {
  const peerId = chat.id;
  const queryClient = useQueryClient();
  const messageAreaRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [replyTo, setReplyTo] = useState<UiMessage>();
  const [status, setStatus] = useState<string | undefined>('Loading messages…');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // the parent remounts this component per chat (`key`), so state starts fresh for every peer
    let cancelled = false;

    const loadHistory = async () => {
      try {
        const { data } = await getChatHistory({ chatId: peerId, count: 50 });
        if (!cancelled) {
          setMessages(current => mergeMessages(current, data.filter(isTextHistoryMessage).reverse().map(toUiMessage)));
          setStatus(undefined);
        }
      } catch (error) {
        if (!cancelled) setStatus(`History failed: ${getErrorMessage(error)}`);
      }
    };

    const poll = async () => {
      while (!cancelled) {
        try {
          const { data } = await receiveNotification();
          if (cancelled) return;
          if (!data?.receiptId) continue;
          const body = data.body;
          const chatIds = [body.senderData?.chatId, body.senderData?.sender, body.chatId].filter(
            (value): value is string => Boolean(value)
          );
          const text =
            body.messageData?.textMessageData?.textMessage ??
            (body.typeMessage === 'textMessage' ? body.textMessage : undefined);
          const quoted = body.messageData?.textMessageData?.quotedMessage;
          if (text && chatIds.some(id => id.trim() === peerId.trim())) {
            setMessages(current =>
              addUniqueMessage(current, {
                id: body.idMessage ?? String(data.receiptId),
                text,
                incoming: true,
                timestamp: body.timestamp,
                replyToId: quoted?.stanzaId,
                replyToText: quoted?.textMessage ?? quoted?.textMessageData?.textMessage
              })
            );
          }
          await deleteNotification(data.receiptId);
        } catch (error) {
          if (!cancelled && axios.isAxiosError(error) && error.response?.status === 408) {
            await delay(250);
          } else if (!cancelled) {
            setStatus(`Receiving failed: ${getErrorMessage(error)}`);
            await delay(2000);
          }
        }
      }
    };

    void loadHistory();
    const historyInterval = window.setInterval(() => void loadHistory(), 2000);
    void poll();
    return () => {
      cancelled = true;
      window.clearInterval(historyInterval);
    };
  }, [peerId]);

  useEffect(() => {
    const area = messageAreaRef.current;
    if (area) area.scrollTop = area.scrollHeight;
  }, [messages.length]);

  const handleSend = async () => {
    const text = message.trim();
    if (!text) return;
    setIsSending(true);
    setStatus(undefined);
    try {
      const { data } = await sendMessage({ chatId: peerId, message: text, quotedMessageId: replyTo?.id });
      setMessages(current =>
        addUniqueMessage(current, {
          id: data.idMessage,
          text,
          incoming: false,
          timestamp: Math.floor(Date.now() / 1000),
          replyToId: replyTo?.id,
          replyToText: replyTo?.text
        })
      );
      setMessage('');
      setReplyTo(undefined);
      void queryClient.invalidateQueries({ queryKey: ['chats', 'list'] });
    } catch (error) {
      setStatus(`Sending failed: ${getErrorMessage(error)}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className={classes.conversation}>
      <header className={classes.header}>
        <ActionIcon variant="subtle" color="gray" size={40} radius="xl" className={classes.back} onClick={onBack} aria-label="Back">
          <ArrowLeft size={22} />
        </ActionIcon>
        <Avatar chatId={chat.id} name={chat.name} saved={chat.isSaved} group={chat.type === 'group'} size={42} />
        <div className={classes.title}>
          <strong>{chat.name}</strong>
          <span>{chat.isSaved ? 'your personal cloud' : chat.type === 'group' ? 'group' : 'last seen recently'}</span>
        </div>
        <div className={classes.actions}>
          <ActionIcon variant="subtle" color="gray" size={40} radius="xl" aria-label="Call">
            <Phone size={20} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" size={40} radius="xl" aria-label="Search">
            <Search size={20} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" size={40} radius="xl" aria-label="More">
            <EllipsisVertical size={20} />
          </ActionIcon>
        </div>
      </header>

      <div ref={messageAreaRef} className={classes.messageArea}>
        {status && <div className={classes.status}>{status}</div>}
        {!status && messages.length === 0 && (
          <div className={classes.emptyState}>
            <MessageCircle size={44} />
            <strong>No messages here yet…</strong>
            <span>Send a message to start the conversation.</span>
          </div>
        )}
        {messages.map(item => (
          <button
            key={item.id}
            type="button"
            className={[classes.bubble, item.incoming ? classes.incoming : classes.outgoing].join(' ')}
            onClick={() => setReplyTo(item)}
          >
            {item.replyToText && <span className={classes.quoted}>{item.replyToText}</span>}
            <span>{item.text}</span>
            <small>
              {formatMessageTime(item.timestamp)}
              {!item.incoming && <CheckCheck size={14} />}
            </small>
          </button>
        ))}
      </div>

      <div className={classes.composer}>
        {replyTo && (
          <div className={classes.replyBar}>
            <span>
              <b>Reply to</b>
              {replyTo.text}
            </span>
            <button type="button" onClick={() => setReplyTo(undefined)} aria-label="Cancel reply">
              <X size={18} />
            </button>
          </div>
        )}
        <div className={classes.composerRow}>
          <div className={classes.inputBox}>
            <button type="button" className={classes.composerButton} aria-label="Emoji">
              <Smile size={22} />
            </button>
            <TextInput
              className={classes.messageInput}
              variant="unstyled"
              placeholder="Message"
              value={message}
              onChange={event => setMessage(event.currentTarget.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
            />
            <button type="button" className={classes.composerButton} aria-label="Attach file">
              <Paperclip size={22} />
            </button>
          </div>
          <button
            type="button"
            className={classes.sendButton}
            disabled={isSending || !message.trim()}
            onClick={() => void handleSend()}
            aria-label="Send message"
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

function isTextHistoryMessage(
  message: MessageTypes.IApi.GetChatHistory.Message
): message is MessageTypes.IApi.GetChatHistory.Message & { idMessage: string; textMessage: string } {
  return Boolean(message.idMessage && message.typeMessage === 'textMessage' && message.textMessage);
}

function toUiMessage(
  message: MessageTypes.IApi.GetChatHistory.Message & { idMessage: string; textMessage: string }
): UiMessage {
  return {
    id: message.idMessage,
    text: message.textMessage,
    incoming: message.type === 'incoming',
    timestamp: message.timestamp,
    replyToId: message.quotedMessage?.stanzaId,
    replyToText: message.quotedMessage?.textMessage ?? message.quotedMessage?.textMessageData?.textMessage
  };
}

function addUniqueMessage(current: UiMessage[], next: UiMessage) {
  return current.some(item => item.id === next.id) ? current : [...current, next];
}

function mergeMessages(current: UiMessage[], incoming: UiMessage[]) {
  return incoming.reduce(addUniqueMessage, current);
}

function delay(milliseconds: number) {
  return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return 'Unable to complete the request.';
  const data = error.response?.data as
    | {
        message?: string;
        description?: string;
        invokeStatus?: { description?: string };
        correspondentsStatus?: { description?: string };
      }
    | undefined;
  return (
    data?.message ??
    data?.description ??
    data?.invokeStatus?.description ??
    data?.correspondentsStatus?.description ??
    error.message
  );
}

export default Conversation;
