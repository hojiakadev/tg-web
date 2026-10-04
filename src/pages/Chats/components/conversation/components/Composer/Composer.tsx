import { useHotkeys, useWindowEvent } from '@mantine/hooks';
import cx from 'clsx';
import { Paperclip, Reply, Send, X } from 'lucide-react';
import { useEffect, useRef, type KeyboardEvent } from 'react';
import { useWatch, type Control } from 'react-hook-form';

import IconButton from '@/components/IconButton';
import { isEditable, isOverlayOpen } from '@/helpers';
import { Textarea } from '@/containers/fields';
import * as Messages from '@/modules/messages';

import EmojiPicker from '../EmojiPicker/EmojiPicker';
import classes from './Composer.module.scss';

type IProps = {
  chatId: string;
  replyTo?: Messages.Types.IEntity.Message;
  onCancelReply: () => void;
  onSent: () => void;
};

/** Enter sends, Shift+Enter inserts a new line. */
const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
  if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
  event.preventDefault();
  event.currentTarget.form?.requestSubmit();
};

const Composer = ({ chatId, replyTo, onCancelReply, onSent }: IProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendFile = Messages.Hooks.useSendFile(chatId);

  // Ctrl/⌘ + O — attach a file (Telegram Desktop)
  useHotkeys([['mod+O', () => !isOverlayOpen() && fileInputRef.current?.click()]], []);

  return (
    <Messages.Forms.Create chatId={chatId} quoted={replyTo} className={classes.composer} onSuccess={onSent}>
      {({ control, getValues, setValue, reset, setFocus }) => (
        <>
          <FocusOnType
            replyId={replyTo?.id}
            focus={() => setFocus('message')}
            insert={char => {
              setValue('message', `${getValues('message')}${char}`, { shouldDirty: true });
              setFocus('message');
            }}
          />

          {replyTo && (
            <div className={classes.reply}>
              <Reply size={20} className={classes.replyIcon} />
              <span className={classes.replyText}>
                <b>{replyTo.direction === 'outgoing' ? 'Reply to yourself' : `Reply to ${replyTo.senderName || 'message'}`}</b>
                {Messages.Mappers.Preview(replyTo)}
              </span>
              <IconButton icon={<X size={20} />} aria-label="Cancel reply" onClick={onCancelReply} />
            </div>
          )}

          <div className={classes.row}>
            <div className={classes.input}>
              <EmojiPicker
                onSelect={emoji => {
                  setValue('message', `${getValues('message')}${emoji}`, { shouldDirty: true });
                  setFocus('message');
                }}
              />
              <Textarea
                control={control}
                name="message"
                variant="unstyled"
                placeholder="Message"
                autosize
                minRows={1}
                maxRows={8}
                autoFocus
                className={classes.textarea}
                classNames={{ input: classes.textareaInput, error: classes.hidden }}
                onKeyDown={submitOnEnter}
              />
              <IconButton
                icon={<Paperclip size={22} />}
                aria-label="Attach a file"
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={event => {
                  const file = event.currentTarget.files?.[0];
                  event.currentTarget.value = '';
                  if (!file) return;

                  sendFile.mutate({ file, caption: getValues('message').trim(), quoted: replyTo });
                  reset({ message: '' });
                  onSent();
                }}
              />
            </div>

            <SendButton control={control} />
          </div>
        </>
      )}
    </Messages.Forms.Create>
  );
};

type IFocusOnTypeProps = {
  replyId?: string;
  focus: () => void;
  /** Adds the typed character and moves the caret into the composer. */
  insert: (char: string) => void;
};

/** Typing anywhere in the chat goes to the composer; choosing a reply focuses it as well. */
const FocusOnType = ({ replyId, focus, insert }: IFocusOnTypeProps) => {
  const handlers = useRef({ focus, insert });

  useEffect(() => {
    handlers.current = { focus, insert };
  });

  useWindowEvent('keydown', event => {
    const printable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (!printable || isEditable(event.target) || isOverlayOpen()) return;

    event.preventDefault();
    handlers.current.insert(event.key);
  });

  useEffect(() => {
    if (replyId) handlers.current.focus();
  }, [replyId]);

  return null;
};

/** Round send button; dimmed while the message is empty. */
const SendButton = ({ control }: { control: Control<Messages.Types.IForm.Create> }) => {
  const message = useWatch({ control, name: 'message' });
  const isEmpty = !message?.trim();

  return (
    <button type="submit" className={cx(classes.send, isEmpty && classes.sendDisabled)} disabled={isEmpty} aria-label="Send message">
      <Send size={22} />
    </button>
  );
};

export default Composer;
