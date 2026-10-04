import { z } from 'zod';

import { DIAL_CODES } from '../constants';

export const loginSchema = z
  .object({
    countryCode: z.string().refine(value => value in DIAL_CODES, 'Choose a country'),
    phoneNumber: z
      .string()
      .trim()
      .transform(value => value.replace(/\D/g, ''))
  })
  .superRefine(({ countryCode, phoneNumber }, context) => {
    const expectedLength = DIAL_CODES[countryCode] === '7' ? 10 : 9;

    if (phoneNumber.length !== expectedLength) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['phoneNumber'], message: 'Enter a valid phone number' });
    }
  });

export const codeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{5,6}$/, 'Enter the code from Telegram')
});

export const passwordSchema = z.object({
  password: z.string().min(1, 'Enter your password')
});
