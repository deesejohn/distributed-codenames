import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { GameSchema } from './models/Game';

const c = initContract();

const gamesContract = c.router({
  getGame: {
    method: 'GET',
    path: `/:game_id/`,
    responses: {
      200: GameSchema,
      404: c.noBody(),
    },
    summary: 'Get a game by id',
  },
  postGameGuess: {
    method: 'POST',
    path: '/:game_id/guess',
    responses: {
      204: c.noBody(),
    },
    body: z.object({
      player_id: z.string(),
      card_id: z.string(),
    }),
    summary: 'Guess',
  },
  postGameHint: {
    method: 'POST',
    path: '/:game_id/hint',
    responses: {
      204: c.noBody(),
    },
    body: z.object({
      player_id: z.string(),
      number: z.number(),
      word: z.string(),
    }),
    summary: 'Hint',
  },
  postGamePlayAgain: {
    method: 'POST',
    path: '/:game_id/play_again',
    responses: {
      204: c.noBody(),
    },
    body: z.object({
      player_id: z.string(),
    }),
    summary: 'Play again',
  },
  postGameSkip: {
    method: 'POST',
    path: '/:game_id/skip',
    responses: {
      204: c.noBody(),
    },
    body: z.object({
      player_id: z.string(),
    }),
    summary: 'Skip',
  },
});

const healthContract = c.router({
  getHealthLive: {
    method: 'GET',
    path: `/health/live`,
    responses: {
      204: c.noBody(),
    },
    summary: 'Liveness check',
  },
  getHealthReady: {
    method: 'GET',
    path: `/health/ready`,
    responses: {
      204: c.noBody(),
      503: c.noBody(),
    },
    summary: 'Readiness check',
  },
});

const contract = c.router({
  games: gamesContract,
  health: healthContract,
});

export default contract;
