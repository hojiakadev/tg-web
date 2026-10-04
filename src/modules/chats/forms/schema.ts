import { z } from 'zod';

/** Positive id = user, negative id = group / channel. */
export const CHAT_ID_PATTERN = /^-?\d{5,}$/;
export const USERNAME_PATTERN = /^@?[a-zA-Z][\w]{3,31}$/;

export const validationSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('phone'),
    value: z
      .string()
      .trim()
      .refine(value => /^\+?[\d\s()-]+$/.test(value), 'Only digits, spaces and + are allowed')
      .refine(value => {
        const digits = value.replace(/\D/g, '').length;
        return digits >= 10 && digits <= 15;
      }, 'Enter the full number with country code, e.g. +998 90 123 45 67')
  }),
  z.object({
    mode: z.literal('chatId'),
    value: z
      .string()
      .trim()
      .refine(
        value => CHAT_ID_PATTERN.test(value) || USERNAME_PATTERN.test(value),
        'Enter a chat ID (e.g. 8515464681) or a @username'
      )
  })
]);
