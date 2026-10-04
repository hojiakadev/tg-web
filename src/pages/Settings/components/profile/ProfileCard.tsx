import { Skeleton } from '@mantine/core';
import cx from 'clsx';
import { AtSign, Info, Phone, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

import Avatar from '@/components/Avatar';
import type * as Profile from '@/modules/profile';

import classes from './ProfileCard.module.scss';

type IProps = {
  profile?: Profile.Types.IEntity.Profile;
  isLoading: boolean;
};

type Row = { icon: LucideIcon; color: 'green' | 'blue' | 'gray'; value: string; label: string };

const copy = (value: string, label: string) =>
  navigator.clipboard
    .writeText(value)
    .then(() => toast.success(`${label} copied`))
    .catch(() => toast.error('Could not copy'));

const ProfileCard = ({ profile, isLoading }: IProps) => {
  if (isLoading || !profile) {
    return (
      <div className={classes.hero}>
        <Skeleton circle height={120} />
        <Skeleton height={20} width={160} mt={12} />
      </div>
    );
  }

  const rows: Row[] = [
    { icon: Phone, color: 'green', value: profile.phone, label: 'Phone' },
    { icon: AtSign, color: 'blue', value: profile.username.replace(/^@/, ''), label: 'Username' },
    { icon: Info, color: 'gray', value: profile.bio, label: 'Bio' }
  ].filter((row): row is Row => Boolean(row.value));

  return (
    <>
      <div className={classes.hero}>
        <Avatar name={profile.name} src={profile.avatar} chatId={profile.chatId} size="lg" />
        <strong className={classes.name}>{profile.name}</strong>
        <span className={cx(classes.status, profile.isOnline && classes.online)}>
          {profile.isOnline ? 'online' : 'offline'}
        </span>
      </div>

      {rows.length > 0 && (
        <div className={classes.card}>
          {rows.map(({ icon: Icon, color, value, label }) => (
            <button key={label} type="button" className={classes.row} onClick={() => copy(value, label)}>
              <span className={cx(classes.icon, classes[color])}>
                <Icon size={18} />
              </span>
              <span className={classes.text}>
                <span>{value}</span>
                <small>{label}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default ProfileCard;
