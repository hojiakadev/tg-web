import { Kbd, Modal } from '@mantine/core';
import { useOs } from '@mantine/hooks';
import { Fragment } from 'react';

import classes from './ShortcutsModal.module.scss';

type IProps = {
  opened: boolean;
  onClose: () => void;
};

type Shortcut = { keys: string[]; action: string };

const sections = (mod: string): { title: string; items: Shortcut[] }[] => [
  {
    title: 'Chats',
    items: [
      { keys: [mod, 'K'], action: 'Search chats' },
      { keys: ['Enter'], action: 'Open the first search result' },
      { keys: ['Alt', '↑'], action: 'Previous chat' },
      { keys: ['Alt', '↓'], action: 'Next chat' },
      { keys: [mod, '0'], action: 'Saved Messages' },
      { keys: ['Esc'], action: 'Close the chat / clear search / go back' }
    ]
  },
  {
    title: 'Messages',
    items: [
      { keys: ['Enter'], action: 'Send message' },
      { keys: ['Shift', 'Enter'], action: 'New line' },
      { keys: [mod, '↑'], action: 'Reply to the previous message' },
      { keys: [mod, '↓'], action: 'Reply to the next message' },
      { keys: ['Esc'], action: 'Cancel reply' },
      { keys: [mod, 'O'], action: 'Attach a file' },
      { keys: ['Any key'], action: 'Start typing a message' }
    ]
  }
];

/** Reference of the Telegram-style keyboard shortcuts available in the app. */
const ShortcutsModal = ({ opened, onClose }: IProps) => {
  const os = useOs();
  const mod = os === 'macos' || os === 'ios' ? '⌘' : 'Ctrl';

  return (
    <Modal opened={opened} onClose={onClose} title="Keyboard Shortcuts" size="md">
      {sections(mod).map(section => (
        <section key={section.title} className={classes.section}>
          <h3 className={classes.title}>{section.title}</h3>
          {section.items.map(item => (
            <div key={`${section.title}-${item.action}`} className={classes.row}>
              <span>{item.action}</span>
              <span className={classes.keys}>
                {item.keys.map((key, index) => (
                  <Fragment key={key}>
                    {index > 0 && '+'}
                    <Kbd>{key}</Kbd>
                  </Fragment>
                ))}
              </span>
            </div>
          ))}
        </section>
      ))}
    </Modal>
  );
};

export default ShortcutsModal;
