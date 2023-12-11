import { z } from 'zod';

export const PlayerSchema = z.object({
  player_id: z.string(),
  nickname: z.string(),
});

export type Player = z.infer<typeof PlayerSchema>;
