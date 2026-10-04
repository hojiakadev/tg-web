import dayjs from 'dayjs';

const ONLINE_THRESHOLD_SECONDS = 60;

/** Chat list time: `08:45` today, `Mon` this week, `03.10.26` otherwise. */
export const formatChatTime = (timestamp?: number) => {
  if (!timestamp) return '';
  const date = dayjs.unix(timestamp);
  const now = dayjs();

  if (date.isSame(now, 'day')) return date.format('HH:mm');
  if (now.diff(date, 'day') < 7) return date.format('ddd');
  return date.format('DD.MM.YY');
};

export const formatMessageTime = (timestamp?: number) => (timestamp ? dayjs.unix(timestamp).format('HH:mm') : '');

/** Date divider label: `Today`, `Yesterday`, `October 3` or `October 3, 2025`. */
export const formatDayLabel = (timestamp: number) => {
  const date = dayjs.unix(timestamp);
  const now = dayjs();

  if (date.isSame(now, 'day')) return 'Today';
  if (date.isSame(now.subtract(1, 'day'), 'day')) return 'Yesterday';
  return date.format(date.isSame(now, 'year') ? 'MMMM D' : 'MMMM D, YYYY');
};

/** Telegram "last seen" status. `0` means hidden by privacy settings. */
export const formatLastSeen = (timestamp: number) => {
  if (!timestamp) return 'last seen recently';

  const date = dayjs.unix(timestamp);
  const now = dayjs();
  if (now.diff(date, 'second') < ONLINE_THRESHOLD_SECONDS) return 'online';
  if (date.isSame(now, 'day')) return `last seen at ${date.format('HH:mm')}`;
  if (date.isSame(now.subtract(1, 'day'), 'day')) return `last seen yesterday at ${date.format('HH:mm')}`;
  return `last seen ${date.format('DD.MM.YY')}`;
};

export const dayKey = (timestamp: number) => dayjs.unix(timestamp).format('YYYY-MM-DD');
