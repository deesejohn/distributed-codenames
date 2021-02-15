import axios from 'axios';
import { Clue, Game } from '../types';

const apiClient = axios.create({ baseURL: '/api/games/' });

const get = async (game_id: string): Promise<Game> => {
  const response = await apiClient.get(game_id);
  return response.data;
};

const guess = async (
  game_id: string,
  player_id: string,
  card_id: string,
): Promise<void> => {
  await apiClient.post(`${game_id}/guess`, {
    player_id: player_id,
    card_id: card_id,
  });
};

const hint = async (
  game_id: string,
  player_id: string,
  clue: Clue, 
): Promise<void> => {
  await apiClient.post(`${game_id}/hint`, {
    player_id: player_id,
    number: clue.number,
    word: clue.word,
  });
};

const methods = {
  get,
  guess,
  hint,
};

export default methods;