import { Button, Menu, Modal, Text, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, EllipsisVertical, LogOut, Moon, Search, Sun } from 'lucide-react';
import { useState } from 'react';

import IconButton from '@/components/IconButton';
import Panel from '@/components/Panel';
import SearchBar from '@/components/SearchBar';
import { isOverlayOpen } from '@/helpers';
import Main from '@/layouts/Main';
import * as Auth from '@/modules/auth';
import * as Profile from '@/modules/profile';

import OptionList from './components/options/OptionList';
import ShortcutsModal from './components/shortcuts/ShortcutsModal';
import ProfileCard from './components/profile/ProfileCard';
import classes from './Settings.module.scss';

function SettingsPage() {
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const isDark = useComputedColorScheme('light') === 'dark';

  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [logoutOpened, logoutModal] = useDisclosure(false);
  const [shortcutsOpened, shortcutsModal] = useDisclosure(false);

  const { data: profile, isLoading } = Profile.Hooks.useProfile();
  const logout = Auth.Hooks.useLogout();

  const goBack = () => {
    if (!searching) return navigate({ to: '/' });
    setSearching(false);
    setSearch('');
  };

  // Escape leaves the settings screen, like every Telegram side panel
  useHotkeys([['Escape', () => !isOverlayOpen() && goBack(), { preventDefault: false }]]);

  const confirmLogout = () =>
    logout.mutate(undefined, {
      onSuccess: () => {
        logoutModal.close();
        navigate({ to: '/login' });
      }
    });

  return (
    <Main
      navbar={
        <Panel
          variant="secondary"
          header={
            <>
              <IconButton icon={<ArrowLeft size={22} />} aria-label="Back" onClick={goBack} />

              {searching ? (
                <SearchBar value={search} onChange={setSearch} placeholder="Search settings" autoFocus />
              ) : (
                <>
                  <h1 className={classes.title}>Settings</h1>
                  <IconButton icon={<Search size={21} />} aria-label="Search" onClick={() => setSearching(true)} />
                  <Menu position="bottom-end" width={200}>
                    <Menu.Target>
                      <IconButton icon={<EllipsisVertical size={21} />} aria-label="More" />
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={isDark ? <Sun size={18} /> : <Moon size={18} />}
                        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
                      >
                        {isDark ? 'Day Mode' : 'Night Mode'}
                      </Menu.Item>
                      <Menu.Item color="red" leftSection={<LogOut size={18} />} onClick={logoutModal.open}>
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
          <OptionList query={search} onShortcuts={shortcutsModal.open} />
        </Panel>
      }
    >
      <ShortcutsModal opened={shortcutsOpened} onClose={shortcutsModal.close} />
      <Modal opened={logoutOpened} onClose={logoutModal.close} title="Log out" size="sm">
        <Text size="sm">Are you sure you want to log out? The Telegram session of this instance will be ended.</Text>
        <div className={classes.modalActions}>
          <Button variant="subtle" color="gray" onClick={logoutModal.close}>
            Cancel
          </Button>
          <Button color="red" loading={logout.isPending} onClick={confirmLogout}>
            Log Out
          </Button>
        </div>
      </Modal>
    </Main>
  );
}

export default SettingsPage;
