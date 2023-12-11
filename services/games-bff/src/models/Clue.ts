import { z } from 'zod';

export const ClueSchema = z.object({
  word: z.string(),
  number: z.number(),
});

export type Clue = z.infer<typeof ClueSchema>;
