import { useNavigate } from '@tanstack/react-router';
import { Menu as MenuIcon, Moon, Settings, Sun } from 'lucide-react';
import { ActionIcon, Menu, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';

import Avatar from '@/components/Avatar';
import type * as ProfileTypes from '@/modules/profile/types';

import classes from './MainMenu.module.scss';

type IProps = {
  profile?: ProfileTypes.IEntity.Profile;
};

const MainMenu = ({ profile }: IProps) => {
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const isDark = useComputedColorScheme('light') === 'dark';

  return (
    <Menu
      position="bottom-start"
      offset={4}
      width={260}
      shadow="md"
      transitionProps={{ transition: 'pop-top-left', duration: 160 }}
      classNames={{
        dropdown: classes.dropdown,
        item: classes.item,
        itemLabel: classes.label,
        itemSection: classes.section,
        divider: classes.divider
      }}
    >
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size={40}
          radius="xl"
          className={classes.trigger}
          aria-label="Open menu"
        >
          <MenuIcon size={22} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          className={classes.account}
          leftSection={<Avatar name={profile?.name ?? ''} src={profile?.avatar} chatId={profile?.chatId} size={24} />}
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
          onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
          leftSection={!isDark ? <Sun size={20} /> : <Moon size={20} />}
        >
          {isDark ? 'Light Mode' : 'Dark mode'}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MainMenu;
