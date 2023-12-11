import { z } from 'zod';
import { CardSchema } from './Card';
import { ClueSchema } from './Clue';
import { PlayerSchema } from './Player';

export const GameSchema = z.object({
  game_id: z.string(),
  host_id: z.string(),
  blue_team: PlayerSchema.array(),
  blue_team_spymaster: z.string(),
  red_team: PlayerSchema.array(),
  red_team_spymaster: z.string(),
  board: CardSchema.array(),
  key: CardSchema.array(),
  guessing: z.string(),
  clue: ClueSchema,
  winner: z.string(),
});

export type Game = z.infer<typeof GameSchema>;
