import { json, urlencoded } from 'body-parser';
import express, { Request, Response } from 'express';
import GameClient from './client';

const app = express();
const GAMES_HOST = process.env.GAMES_HOST || 'localhost:4000';
export const gameClient = new GameClient(GAMES_HOST);

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

app.get('/:game_id/', (req, res, next) => {
  gameClient
    .get(req.params.game_id)
    .then(game => {
      if (!game) {
        res.status(404).send();
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
  number: number;
  word: string;
}
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
  number: number;
  word: string;
}
app.post(
  '/:game_id/skip',
  (req: Request<SkipParams, never, SkipReqBody>, res, next) => {
    gameClient
      .skipTurn(req.params.game_id, req.body.player_id)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  }
);

app.get('/health/live', (_, res) => res.status(204).send());
app.get('/health/ready', (_, res) => res.status(204).send());

app.use((err: unknown, req: Request, res: Response) => {
  res.status(500).send({ error: 'An unknown error has occurred' });
});

export default app;
