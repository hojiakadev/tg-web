import { useInViewport } from '@mantine/hooks';
import cx from 'clsx';
import { Bookmark } from 'lucide-react';
import { useState } from 'react';

import { avatarColorIndex, initials } from '@/helpers';
import * as Contacts from '@/modules/contacts';

import classes from './Avatar.module.scss';

type IProps = {
  /** Telegram chat id — used to lazily fetch the photo and to pick a stable color. */
  chatId?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Known photo URL (skips the `getAvatar` request). */
  src?: string;
  /** Renders the "Saved Messages" bookmark. */
  saved?: boolean;
  className?: string;
};

const Avatar = ({ chatId = '', name, size = 'md', src, saved = false, className }: IProps) => {
  const { ref, inViewport } = useInViewport();
  const [broken, setBroken] = useState(false);

  // a disabled query still returns its cached value, so the photo stays once loaded
  const { data: fetched } = Contacts.Hooks.useAvatar(chatId, !src && !saved && inViewport);
  const photo = broken ? '' : src || fetched;

  return (
    <span
      ref={ref}
      className={cx(
        classes.avatar,
        classes[size],
        saved ? classes.saved : classes[`color${avatarColorIndex(chatId || name)}`],
        className
      )}
      aria-hidden
    >
      {saved ? (
        <Bookmark className={classes.icon} fill="currentColor" strokeWidth={1.5} />
      ) : photo ? (
        <img src={photo} alt="" loading="lazy" onError={() => setBroken(true)} />
      ) : (
        initials(name)
      )}
    </span>
  );
};

export default Avatar;
