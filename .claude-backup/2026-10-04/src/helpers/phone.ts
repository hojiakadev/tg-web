/** `998991954535@c.us` -> `998991954535` (empty for groups / non-phone ids). */
export const phoneFromChatId = (chatId = '') => {
  const [local, domain] = chatId.split('@');
  if (domain && domain !== 'c.us' && domain !== 's.whatsapp.net') return '';
  return /^\d+$/.test(local) ? local : '';
};

/** `998991954535` -> `+998 99 195 45 35` */
export const formatPhone = (phone = '') => {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('998') && digits.length === 12) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  if (digits.startsWith('7') && digits.length === 11) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }

  return `+${digits}`;
};

/** Accepts a free-form phone number and returns a Green-API personal chat id. */
export const chatIdFromPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits ? `${digits}@c.us` : '';
};
