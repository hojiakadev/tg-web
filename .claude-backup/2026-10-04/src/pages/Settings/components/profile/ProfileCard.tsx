import { Skeleton } from '@mantine/core';
import { AtSign, Info, Phone, ShieldCheck } from 'lucide-react';

import Avatar from '@/components/Avatar';
import { formatPhone } from '@/helpers';
import type * as ProfileTypes from '@/modules/profile/types';

import classes from './ProfileCard.module.scss';

type IProps = {
  profile?: ProfileTypes.IEntity.Profile;
  isLoading: boolean;
};

const INSTANCE_ID = String(import.meta.env.VITE_INSTANCE ?? '').replace('waInstance', '');

const ProfileCard = ({ profile, isLoading }: IProps) => {
  const online = profile?.state === 'authorized';

  const rows = [
    { icon: Phone, color: '#4fae4e', value: formatPhone(profile?.phone), label: 'Phone' },
    { icon: AtSign, color: '#3390ec', value: INSTANCE_ID, label: 'Instance' },
    { icon: Info, color: '#8e99a4', value: profile?.bio, label: 'Bio' },
    { icon: ShieldCheck, color: '#a86de8', value: profile?.state, label: 'Status' }
  ].filter(row => Boolean(row.value));

  return (
    <>
      <div className={classes.hero}>
        {isLoading ? (
          <Skeleton circle height={120} />
        ) : (
          <Avatar name={profile?.name ?? ''} src={profile?.avatar} chatId={profile?.chatId} size={120} />
        )}
        <strong className={classes.name}>{isLoading ? <Skeleton height={20} width={140} /> : profile?.name}</strong>
        <span className={online ? classes.online : classes.offline}>{online ? 'online' : profile?.state || ' '}</span>
      </div>

      {rows.length > 0 && (
        <div className={classes.card}>
          {rows.map(({ icon: Icon, color, value, label }) => (
            <div key={label} className={classes.row}>
              <span className={classes.rowIcon} style={{ backgroundColor: color }}>
                <Icon size={18} />
              </span>
              <span className={classes.rowText}>
                <span>{value}</span>
                <small>{label}</small>
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProfileCard;
