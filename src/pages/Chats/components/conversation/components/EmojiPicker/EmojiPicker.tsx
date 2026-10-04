import { Popover } from '@mantine/core';
import { Smile } from 'lucide-react';
import { useState } from 'react';

import IconButton from '@/components/IconButton';

import classes from './EmojiPicker.module.scss';

type IProps = {
  onSelect: (emoji: string) => void;
};

const EMOJIS = [
  '😀', '😂', '🤣', '😊', '😍', '😘', '😎', '🤔', '😏', '😢', '😭', '😡',
  '😱', '🥳', '😴', '🤗', '🙄', '😇', '🤩', '😅', '😉', '🙂', '🙃', '🥲',
  '👍', '👎', '👏', '🙏', '💪', '🤝', '👋', '✌️', '👌', '🤞', '☝️', '👀',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🔥', '✨', '🎉', '💯', '✅', '❌'
];

/** Small Telegram-like emoji panel for the composer. */
const EmojiPicker = ({ onSelect }: IProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover opened={opened} onChange={setOpened} position="top-start" offset={12} shadow="md" radius="lg">
      <Popover.Target>
        <IconButton icon={<Smile size={22} />} aria-label="Emoji" onClick={() => setOpened(value => !value)} />
      </Popover.Target>
      <Popover.Dropdown className={classes.dropdown}>
        <div className={classes.grid}>
          {EMOJIS.map(emoji => (
            <button key={emoji} type="button" className={classes.emoji} onClick={() => onSelect(emoji)}>
              {emoji}
            </button>
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default EmojiPicker;
