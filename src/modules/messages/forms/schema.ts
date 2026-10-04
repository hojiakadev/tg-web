import { z } from 'zod';

import { MESSAGE_MAX_LENGTH } from '../constants';

export const validationSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message is empty')
    .max(MESSAGE_MAX_LENGTH, `Message is longer than ${MESSAGE_MAX_LENGTH} characters`)
});
