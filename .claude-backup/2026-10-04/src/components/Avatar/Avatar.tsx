import { useInViewport } from '@mantine/hooks';
import { Bookmark, Users } from 'lucide-react';
import { useState, type CSSProperties } from 'react';

import { avatarGradient, initials } from '@/helpers';

import * as Contacts from '@/modules/contacts';

import classes from './Avatar.module.scss';

type IProps = {
  /** Green-API chat id — used to lazily fetch the photo and pick a stable color. */
  chatId?: string;
  name: string;
  size?: number;
  /** Explicit photo url (skips the getAvatar request). */
  src?: string;
  saved?: boolean;
  group?: boolean;
  className?: string;
};

const Avatar = ({ chatId, name, size = 54, src, saved, group, className }: IProps) => {
  const { ref, inViewport } = useInViewport();
  const [broken, setBroken] = useState(false);

  // a disabled query still returns its cached value, so the photo stays once it has been loaded
  const { data: fetched } = Contacts.Hooks.useAvatar(chatId, !src && !saved && inViewport);
  const photo = !broken && (src || fetched);

  const style = {
    '--avatar-size': `${size}px`,
    background: saved ? 'linear-gradient(#72d5fd, #2a9ef1)' : avatarGradient(chatId || name)
  } as CSSProperties;

  return (
    <span ref={ref} className={[classes.avatar, className].filter(Boolean).join(' ')} style={style} aria-hidden>
      {saved ? (
        <Bookmark size={size * 0.42} fill="currentColor" strokeWidth={1.5} />
      ) : photo ? (
        <img src={photo} alt="" loading="lazy" onError={() => setBroken(true)} />
      ) : group && !name ? (
        <Users size={size * 0.42} />
      ) : (
        initials(name)
      )}
    </span>
  );
};

export default Avatar;
