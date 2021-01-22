import { Card } from './Card';
import { Clue } from './Clue';
import { Player } from './Player';

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
};