/** `998991954535` -> `+998 99 195 45 35`. Accepts numbers too (Green-API returns `0` for hidden phones). */
export const formatPhone = (phone: string | number = '') => {
  const digits = String(phone).replace(/\D/g, '');
  if (!digits || /^0+$/.test(digits)) return '';

  if (digits.startsWith('998') && digits.length === 12) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  if (digits.startsWith('7') && digits.length === 11) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }

  return `+${digits}`;
};

/** Keeps only the digits of a free-form phone number. */
export const phoneDigits = (phone: string) => phone.replace(/\D/g, '');
