import { Player } from './player';

export interface Lobby {
  host_id: string;
  lobby_id: string;
  blue_team: Player[];
  red_team: Player[];
  game_id: string;
}
