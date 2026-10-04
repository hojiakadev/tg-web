import { Menu } from '@mantine/core';
import cx from 'clsx';
import { Megaphone, Pencil, UserPlus, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import Fab from '@/components/Fab';

import classes from './ComposeMenu.module.scss';

type IProps = {
  onNewPrivateChat: () => void;
};

const soon = (feature: string) => () => toast.info(`${feature} — coming soon`);

/** Pencil button of the chat list and its "new …" menu. */
const ComposeMenu = ({ onNewPrivateChat }: IProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      position="top-end"
      offset={14}
      width={300}
      transitionProps={{ transition: 'pop-bottom-right', duration: 160 }}
      classNames={{ dropdown: classes.dropdown, item: classes.item, itemSection: classes.section }}
    >
      <Menu.Target>
        <Fab
          aria-label={opened ? 'Close menu' : 'New message'}
          icon={
            <span className={cx(classes.icon, opened && classes.opened)}>
              <Pencil size={22} className={classes.pencil} />
              <X size={26} className={classes.close} />
            </span>
          }
        />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<UserRound size={24} />} onClick={onNewPrivateChat}>
          New Chat
        </Menu.Item>
        <Menu.Item leftSection={<Megaphone size={24} />} onClick={soon('Channels')}>
          New Channel
        </Menu.Item>
        <Menu.Item leftSection={<UserPlus size={24} />} onClick={soon('Groups')}>
          New Group
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ComposeMenu;
