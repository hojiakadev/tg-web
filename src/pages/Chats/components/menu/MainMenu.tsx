import { Menu, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { Menu as MenuIcon, Moon, Settings, Sun } from 'lucide-react';

import Avatar from '@/components/Avatar';
import IconButton from '@/components/IconButton';
import type * as Profile from '@/modules/profile';

import classes from './MainMenu.module.scss';

type IProps = {
  profile?: Profile.Types.IEntity.Profile;
};

/** Hamburger menu of the chat list. */
const MainMenu = ({ profile }: IProps) => {
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const isDark = useComputedColorScheme('light') === 'dark';

  return (
    <Menu position="bottom-start" offset={4} width={260}>
      <Menu.Target>
        <IconButton icon={<MenuIcon size={22} />} aria-label="Open menu" />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          className={classes.account}
          leftSection={<Avatar name={profile?.name ?? ''} src={profile?.avatar} chatId={profile?.chatId} size="xs" />}
          onClick={() => navigate({ to: '/settings' })}
        >
          {profile?.name ?? 'My account'}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item leftSection={<Settings size={20} />} onClick={() => navigate({ to: '/settings' })}>
          Settings
        </Menu.Item>

        <Menu.Item
          closeMenuOnClick={false}
          leftSection={isDark ? <Sun size={20} /> : <Moon size={20} />}
          onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MainMenu;
