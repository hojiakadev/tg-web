import dayjs from 'dayjs';

/** Telegram-like chat list time: `08:45 AM` today, `Mon` this week, `03.10.26` otherwise. */
export const formatChatTime = (timestamp?: number) => {
  if (!timestamp) return '';
  const date = dayjs.unix(timestamp);
  const now = dayjs();

  if (date.isSame(now, 'day')) return date.format('hh:mm A');
  if (now.diff(date, 'day') < 7) return date.format('ddd');
  return date.format('DD.MM.YY');
};

export const formatMessageTime = (timestamp?: number) => (timestamp ? dayjs.unix(timestamp).format('HH:mm') : '');
