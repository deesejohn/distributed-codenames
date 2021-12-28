import axios from 'axios';
import { Clue, Game } from '../types';

const apiClient = axios.create({ baseURL: '/api/games/' });

export const get = async (gameId: string): Promise<Game> => {
  const response = await apiClient.get<Game>(`${gameId}/`);
  return response.data;
};

export const guess = async (
  gameId: string,
  playerId: string,
  cardCd: string
): Promise<void> => {
  await apiClient.post(`${gameId}/guess`, {
    player_id: playerId,
    card_id: cardCd,
  });
};

export const hint = async (
  gameId: string,
  playerId: string,
  clue: Clue
): Promise<void> => {
  await apiClient.post(`${gameId}/hint`, {
    player_id: playerId,
    number: clue.number,
    word: clue.word,
  });
};

export const playAgain = async (
  gameId: string,
  playerId: string
): Promise<void> => {
  await apiClient.post(`${gameId}/play_again`, {
    player_id: playerId,
  });
};

export const skip = async (gameId: string, playerId: string): Promise<void> => {
  await apiClient.post(`${gameId}/skip`, {
    player_id: playerId,
  });
};
