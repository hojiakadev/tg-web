import { AlertCircle, Check, CheckCheck, Clock3 } from 'lucide-react';

import type * as Messages from '@/modules/messages';

type IProps = {
  status: Messages.Types.IEntity.Status;
  className?: string;
};

const ICONS = {
  pending: Clock3,
  sent: Check,
  read: CheckCheck,
  failed: AlertCircle
} as const;

/** Telegram ticks: clock → one check (sent) → two checks (read); red mark when failed. */
const MessageStatus = ({ status, className }: IProps) => {
  const Icon = ICONS[status];
  return <Icon size={16} strokeWidth={2.2} className={className} aria-label={status} />;
};

export default MessageStatus;
