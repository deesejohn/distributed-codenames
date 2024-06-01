import { json, urlencoded } from 'body-parser';
import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { generateOpenApi } from '@ts-rest/open-api';
import GameClient from './client';
import contract from './contract';
import { connection as natsConnection } from './subscriber';

const openApiDocument = generateOpenApi(contract, {
  info: {
    title: 'Games BFF',
    version: '1.0.0',
  },
});

const app = express();
const GAMES_HOST = process.env.GAMES_HOST || 'localhost:4000';
export const gameClient = new GameClient(GAMES_HOST);

app.use(
  urlencoded({
    extended: false,
  })
);
app.use(json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

const s = initServer();

const router = s.router(contract, {
  games: {
    getGame: async ({ params: { game_id } }) => {
      const game = await gameClient.get(game_id);
      if (!game) {
        return {
          status: 404,
        };
      }
      return {
        status: 200,
        body: game,
      };
    },
    postGameGuess: async ({
      params: { game_id },
      body: { player_id, card_id },
    }) => {
      await gameClient.guess(game_id, player_id, card_id);
      return {
        status: 204,
        body: undefined,
      };
    },
    postGameHint: async ({
      params: { game_id },
      body: { player_id, number, word },
    }) => {
      await gameClient.hint(game_id, player_id, { number, word });
      return {
        status: 204,
        body: undefined,
      };
    },
    postGamePlayAgain: async ({ params: { game_id }, body: { player_id } }) => {
      await gameClient.playAgain(game_id, player_id);
      return {
        status: 204,
        body: undefined,
      };
    },
    postGameSkip: async ({ params: { game_id }, body: { player_id } }) => {
      await gameClient.skipTurn(game_id, player_id);
      return {
        status: 204,
        body: undefined,
      };
    },
  },
  health: {
    getHealthLive: async () =>
      Promise.resolve({
        status: 204,
        body: undefined,
      }),
    getHealthReady: async () => {
      if (await natsConnection) {
        return {
          status: 204,
          body: undefined,
        };
      }
      return {
        status: 503,
      };
    },
  },
});

createExpressEndpoints(contract, router, app);

export default app;
