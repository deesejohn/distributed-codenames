import { z } from 'zod';

export const CardSchema = z.object({
  card_id: z.string(),
  label: z.string(),
  color: z.number(),
  revealed: z.boolean(),
});

export type Card = z.infer<typeof CardSchema>;
