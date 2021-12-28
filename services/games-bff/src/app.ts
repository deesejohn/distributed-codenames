import { json, urlencoded } from 'body-parser';
import express, { Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import GameClient from './client';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Games BFF',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.HOST_PREFIX || '/',
      },
    ],
  },
  apis: ['./src/**/*.ts'],
};

const openapiSpecification = swaggerJsdoc(options);

const app = express();
// eslint-disable-next-line
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
const GAMES_HOST = process.env.GAMES_HOST || 'localhost:4000';
export const gameClient = new GameClient(GAMES_HOST);

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

/**
 * @openapi
 * /{game_id}:
 *   get:
 *     summary: Get a game by id
 *     tags:
 *       - Games
 *     parameters:
 *       - name: game_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/game'
 *       404:
 *         description: Not found
 */
app.get('/:game_id/', (req, res, next) => {
  gameClient
    .get(req.params.game_id)
    .then(game => {
      if (!game) {
        res.status(404).send();
        return;
      }
      res.send(game);
    })
    .catch(err => next(err));
});

interface GuessParams {
  game_id: string;
}
interface GuessReqBody {
  player_id: string;
  card_id: string;
}
/**
 * @openapi
 * /{game_id}/guess:
 *   post:
 *     summary: Guess
 *     tags:
 *       - Games
 *     parameters:
 *       - name: game_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               player_id:
 *                 type: string
 *               card_id:
 *                 type: string
 *     responses:
 *       204:
 *         description: no content
 */
app.post(
  '/:game_id/guess',
  (req: Request<GuessParams, never, GuessReqBody>, res, next) => {
    gameClient
      .guess(req.params.game_id, req.body.player_id, req.body.card_id)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  }
);

interface HintParams {
  game_id: string;
}
interface HintReqBody {
  player_id: string;
  number: number;
  word: string;
}
/**
 * @openapi
 * /{game_id}/hint:
 *   post:
 *     summary: Hint
 *     tags:
 *       - Games
 *     parameters:
 *       - name: game_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               player_id:
 *                 type: string
 *               number:
 *                 type: number
 *               word:
 *                 type: string
 *     responses:
 *       204:
 *         description: no content
 */
app.post(
  '/:game_id/hint',
  (req: Request<HintParams, never, HintReqBody>, res, next) => {
    gameClient
      .hint(req.params.game_id, req.body.player_id, req.body)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  }
);

interface PlayAgainParams {
  game_id: string;
}
interface PlayAgainReqBody {
  player_id: string;
}
/**
 * @openapi
 * /{game_id}/play_again:
 *   post:
 *     summary: Play again
 *     tags:
 *       - Games
 *     parameters:
 *       - name: game_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               player_id:
 *                 type: string
 *     responses:
 *       204:
 *         description: no content
 */
app.post(
  '/:game_id/play_again',
  (req: Request<PlayAgainParams, never, PlayAgainReqBody>, res, next) => {
    gameClient
      .playAgain(req.params.game_id, req.body.player_id)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  }
);

interface SkipParams {
  game_id: string;
}
interface SkipReqBody {
  player_id: string;
}
/**
 * @openapi
 * /{game_id}/skip:
 *   post:
 *     summary: Skip
 *     tags:
 *       - Games
 *     parameters:
 *       - name: game_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               player_id:
 *                 type: string
 *     responses:
 *       204:
 *         description: no content
 */
app.post(
  '/:game_id/skip',
  (req: Request<SkipParams, never, SkipReqBody>, res, next) => {
    gameClient
      .skipTurn(req.params.game_id, req.body.player_id)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  }
);

/**
 * @openapi
 * /health/live:
 *   get:
 *     summary: live
 *     tags:
 *       - Health
 *     responses:
 *       204:
 *         description: no content
 */
app.get('/health/live', (_, res) => res.status(204).send());
/**
 * @openapi
 * /health/ready:
 *   get:
 *     summary: ready
 *     tags:
 *       - Health
 *     responses:
 *       204:
 *         description: no content
 */
app.get('/health/ready', (_, res) => res.status(204).send());

app.use((err: unknown, req: Request, res: Response) => {
  res.status(500).send({ error: 'An unknown error has occurred' });
});

export default app;
