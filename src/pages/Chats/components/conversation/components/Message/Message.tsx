import { Menu } from '@mantine/core';
import cx from 'clsx';
import { Copy, FileText, Reply } from 'lucide-react';
import { toast } from 'sonner';

import { formatMessageTime } from '@/helpers';
import * as Messages from '@/modules/messages';

import classes from './Message.module.scss';
import MessageStatus from './MessageStatus';

type IProps = {
  message: Messages.Types.IEntity.Message;
  /** Text of the message this one replies to. */
  quotedText?: string;
  /** Sender name shown above the first incoming bubble of a group chat run. */
  senderName?: string;
  /** Last bubble of a run of messages from the same sender — gets the tail. */
  isLast: boolean;
  onReply: (message: Messages.Types.IEntity.Message) => void;
};

const MessageContent = ({ message }: { message: Messages.Types.IEntity.Message }) => {
  switch (message.kind) {
    case 'image':
    case 'sticker':
      return message.fileUrl ? (
        <a href={message.fileUrl} target="_blank" rel="noreferrer" className={classes.media}>
          <img src={message.fileUrl} alt={message.text || 'Photo'} loading="lazy" />
        </a>
      ) : null;
    case 'video':
      return message.fileUrl ? <video className={classes.media} src={message.fileUrl} controls preload="metadata" /> : null;
    case 'audio':
      return message.fileUrl ? <audio className={classes.audio} src={message.fileUrl} controls preload="none" /> : null;
    case 'document':
      return (
        <a className={classes.document} href={message.fileUrl || undefined} target="_blank" rel="noreferrer" download>
          <span className={classes.documentIcon}>
            <FileText size={22} />
          </span>
          <span className={classes.documentName}>{message.fileName || 'File'}</span>
        </a>
      );
    default:
      return null;
  }
};

const Message = ({ message, quotedText, senderName, isLast, onReply }: IProps) => {
  const outgoing = message.direction === 'outgoing';
  const isSticker = message.kind === 'sticker';
  const hasText = Boolean(message.text) && !isSticker;

  const copy = () =>
    navigator.clipboard
      .writeText(message.text)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Could not copy'));

  return (
    <div className={cx(classes.row, outgoing ? classes.outgoing : classes.incoming)}>
      <Menu position="bottom-start" width={180}>
        <Menu.ContextMenu>
          <div
            className={cx(
              classes.bubble,
              isLast && classes.tail,
              isSticker && classes.sticker,
              message.kind === 'service' && classes.service
            )}
            onDoubleClick={() => onReply(message)}
          >
            {senderName && <span className={classes.sender}>{senderName}</span>}
            {quotedText && <span className={classes.quote}>{quotedText}</span>}
            <MessageContent message={message} />
            {hasText && <span className={classes.text}>{message.text}</span>}
            <span className={cx(classes.meta, !hasText && classes.metaOverlay)}>
              {formatMessageTime(message.timestamp)}
              {outgoing && (
                <MessageStatus status={message.status} className={cx(message.status === 'failed' && classes.failed)} />
              )}
            </span>
          </div>
        </Menu.ContextMenu>

        <Menu.Dropdown>
          <Menu.Item leftSection={<Reply size={18} />} onClick={() => onReply(message)}>
            Reply
          </Menu.Item>
          {hasText && (
            <Menu.Item leftSection={<Copy size={18} />} onClick={copy}>
              Copy Text
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default Message;
