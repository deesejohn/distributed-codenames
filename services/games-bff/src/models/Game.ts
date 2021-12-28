import { Card } from './Card';
import { Clue } from './Clue';
import { Player } from './Player';

/**
 * @openapi
 * components:
 *   schemas:
 *     game:
 *       type: object
 *       properties:
 *         game_id:
 *           type: string
 *         host_id:
 *           type: string
 *         blue_team:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/player'
 *         blue_team_spymaster:
 *           type: string
 *         red_team:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/player'
 *         red_team_spymaster:
 *           type: string
 *         board:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/card'
 *         key:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/card'
 *         guessing:
 *           type: string
 *         clue:
 *           $ref: '#/components/schemas/clue'
 *         winner:
 *           type: string
 */
export interface Game {
  game_id: string;
  host_id: string;
  blue_team: Player[];
  blue_team_spymaster: string;
  red_team: Player[];
  red_team_spymaster: string;
  board: Card[];
  key: Card[];
  guessing: string;
  clue: Clue;
  winner: string;
}
