import { z } from 'zod';

export const loginSchema = z
  .object({
  countryCode: z.enum(['+998', 'ru:+7', 'kz:+7', '+996', '+992']),
  phoneNumber: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ''))
  })
  .superRefine(({ countryCode, phoneNumber }, context) => {
    const expectedLength = countryCode.includes('+7') ? 10 : 9;

    if (phoneNumber.length !== expectedLength) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: 'Enter a valid phone number',
      });
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
