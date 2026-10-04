import { Menu } from '@mantine/core';
import { Archive, ArrowLeft, Copy, EllipsisVertical } from 'lucide-react';
import { toast } from 'sonner';

import Avatar from '@/components/Avatar';
import IconButton from '@/components/IconButton';
import { formatLastSeen } from '@/helpers';
import * as Chats from '@/modules/chats';
import * as Contacts from '@/modules/contacts';

import classes from './Header.module.scss';

type IProps = {
  chat: Chats.Types.IEntity.Chat;
  onBack: () => void;
};

const pluralize = (count: number, word: string) => `${count.toLocaleString()} ${word}${count === 1 ? '' : 's'}`;

/** Status line under the chat title, Telegram-style. */
const useSubtitle = (chat: Chats.Types.IEntity.Chat) => {
  const isGroup = chat.type === 'group' || chat.type === 'channel';
  const user = Contacts.Hooks.useSingle(chat.id, chat.type === 'user' && !chat.isSaved);
  const group = Chats.Hooks.useGroup(chat.id, isGroup);

  if (chat.isSaved) return '';
  if (chat.type === 'bot') return 'bot';
  if (isGroup) {
    const size = group.data?.size;
    return size ? pluralize(size, chat.type === 'channel' ? 'subscriber' : 'member') : chat.type;
  }
  if (user.data?.isBot) return 'bot';
  return user.data ? formatLastSeen(user.data.lastSeen) : 'last seen recently';
};

const Header = ({ chat, onBack }: IProps) => {
  const title = Chats.Hooks.useTitle(chat);
  const subtitle = useSubtitle(chat);
  const archive = Chats.Hooks.useArchive();

  const copyId = () =>
    navigator.clipboard
      .writeText(chat.id)
      .then(() => toast.success('Chat ID copied'))
      .catch(() => toast.error('Could not copy'));

  return (
    <header className={classes.header}>
      <IconButton icon={<ArrowLeft size={22} />} aria-label="Back" className={classes.back} onClick={onBack} />
      <Avatar chatId={chat.id} name={title} saved={chat.isSaved} size="sm" />

      <div className={classes.title}>
        <strong>{title}</strong>
        {subtitle && <span className={subtitle === 'online' ? classes.online : undefined}>{subtitle}</span>}
      </div>

      <Menu position="bottom-end" width={200}>
        <Menu.Target>
          <IconButton icon={<EllipsisVertical size={20} />} aria-label="More actions" />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<Copy size={18} />} onClick={copyId}>
            Copy Chat ID
          </Menu.Item>
          {!chat.isSaved && (
            <Menu.Item leftSection={<Archive size={18} />} onClick={() => archive.mutate(chat.id)}>
              Archive Chat
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </header>
  );
};

export default Header;
