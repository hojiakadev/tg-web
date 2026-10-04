import { toast } from 'sonner';
import { useState } from 'react';
import { Menu } from '@mantine/core';
import { Megaphone, Pencil, UserPlus, UserRound, X } from 'lucide-react';

import Fab from '@/components/Fab';

import classes from './ComposeMenu.module.scss';

type IProps = {
  onNewPrivateChat: () => void;
};

const ComposeMenu = ({ onNewPrivateChat }: IProps) => {
  const [opened, setOpened] = useState(false);

  const notSupported = (feature: string) => toast.info(`${feature} is not supported by Green-API yet`);

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
            <span className={[classes.icon, opened ? classes.iconOpened : ''].filter(Boolean).join(' ')}>
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
        <Menu.Item leftSection={<Megaphone size={24} />} onClick={() => notSupported('Channels')}>
          New Channel
        </Menu.Item>
        <Menu.Item leftSection={<UserPlus size={24} />} onClick={() => notSupported('Creating groups')}>
          New Group
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ComposeMenu;
