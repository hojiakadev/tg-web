import { ActionIcon, Menu, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, EllipsisVertical, LogOut, Moon, Search, Sun } from 'lucide-react';
import { useState } from 'react';

import Panel from '@/components/Panel';
import SearchBar from '@/components/SearchBar';
import Main from '@/layouts/Main';
import { signOut } from '@/modules/auth/utils/auth';
import * as Profile from '@/modules/profile';

import OptionList from './components/options/OptionList';
import ProfileCard from './components/profile/ProfileCard';
import classes from './Settings.module.scss';

function SettingsPage() {
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const isDark = useComputedColorScheme('light') === 'dark';

  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');

  const { data: profile, isLoading } = Profile.Hooks.useProfile();

  const goBack = () => {
    if (searching) {
      setSearching(false);
      setSearch('');
      return;
    }
    navigate({ to: '/' });
  };

  const logOut = () => {
    signOut();
    navigate({ to: '/login' });
  };

  return (
    <Main
      navbar={
        <Panel
          className={classes.panel}
          header={
            <>
              <ActionIcon variant="subtle" color="gray" size={40} radius="xl" className={classes.icon} aria-label="Back" onClick={goBack}>
                <ArrowLeft size={22} />
              </ActionIcon>

              {searching ? (
                <SearchBar value={search} onChange={setSearch} placeholder="Search settings" autoFocus />
              ) : (
                <>
                  <h1 className={classes.title}>Settings</h1>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size={40}
                    radius="xl"
                    className={classes.icon}
                    aria-label="Search"
                    onClick={() => setSearching(true)}
                  >
                    <Search size={21} />
                  </ActionIcon>
                  <Menu position="bottom-end" width={200} shadow="md" radius="md">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size={40} radius="xl" className={classes.icon} aria-label="More">
                        <EllipsisVertical size={21} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={isDark ? <Sun size={18} /> : <Moon size={18} />}
                        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
                      >
                        {isDark ? 'Day Mode' : 'Night Mode'}
                      </Menu.Item>
                      <Menu.Item color="red" leftSection={<LogOut size={18} />} onClick={logOut}>
                        Log Out
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </>
              )}
            </>
          }
        >
          {!searching && <ProfileCard profile={profile} isLoading={isLoading} />}
          <OptionList query={search} />
        </Panel>
      }
    />
  );
}

export default SettingsPage;
