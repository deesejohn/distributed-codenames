import http from 'http';
import { json } from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import * as grpc from '@grpc/grpc-js';
import { connect, StringCodec } from 'nats';
import { Server } from 'ws';
import { GamesServiceClient } from './genproto/games_grpc_pb';
import {
  Card as GrpcCard,
  Clue as GrpcClue,
  Game as GrpcGame,
  GetGameRequest,
  GuessRequest,
  HintRequest,
  PlayAgainRequest,
  Player as GrpcPlayer,
  SkipTurnRequest,
} from './genproto/games_pb';
import { Card, Game, Player } from './models';

const app = express();
const server = http.createServer(app);
const GAMES_HOST = process.env.GAMES_HOST || 'localhost:4000';
const NATS_HOST = process.env.NATS_HOST || '';
const PORT = 8000;

const gameClient = new GamesServiceClient(
  GAMES_HOST,
  grpc.credentials.createInsecure()
);

function mapCard(dto: GrpcCard.AsObject): Card {
  return {
    card_id: dto.cardId,
    label: dto.label,
    color: dto.color,
    revealed: dto.revealed,
  };
}

function mapPlayer(dto: GrpcPlayer.AsObject): Player {
  return {
    player_id: dto.playerId,
    nickname: dto.nickname,
  };
}

function mapGame(dto: GrpcGame.AsObject): Game {
  return {
    game_id: dto.gameId,
    host_id: dto.hostId,
    blue_team: dto.blueTeamList.map(mapPlayer),
    blue_team_spymaster: dto.blueTeamSpymaster,
    red_team: dto.redTeamList.map(mapPlayer),
    red_team_spymaster: dto.redTeamSpymaster,
    board: dto.boardList.map(mapCard),
    key: dto.keyList.map(mapCard),
    guessing: dto.guessing,
    clue: {
      word: dto.clue.word,
      number: dto.clue.number,
    },
    winner: dto.winner,
  };
}

app.use(json());

app.get('/:game_id/', (req, res, next) => {
  const request = new GetGameRequest();
  request.setGameId(req.params.game_id);
  gameClient.getGame(request, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.send(mapGame(data.getGame().toObject()));
  });
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
    const request = new GuessRequest();
    request.setGameId(req.params.game_id);
    request.setPlayerId(req.body.player_id);
    request.setCardId(req.body.card_id);
    gameClient.guess(request, err => {
      if (err) {
        return next(err);
      }
      return res.status(204).send();
    });
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
    const request = new HintRequest();
    request.setGameId(req.params.game_id);
    request.setPlayerId(req.body.player_id);
    const clue = new GrpcClue();
    clue.setNumber(req.body.number);
    clue.setWord(req.body.word);
    request.setClue(clue);
    gameClient.hint(request, err => {
      if (err) {
        return next(err);
      }
      return res.status(204).send();
    });
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
    const request = new PlayAgainRequest();
    request.setGameId(req.params.game_id);
    request.setPlayerId(req.body.player_id);
    gameClient.playAgain(request, err => {
      if (err) {
        return next(err);
      }
      return res.status(204).send();
    });
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
    const request = new SkipTurnRequest();
    request.setGameId(req.params.game_id);
    request.setPlayerId(req.body.player_id);
    gameClient.skipTurn(request, err => {
      if (err) {
        return next(err);
      }
      return res.status(204).send();
    });
  }
);

app.get('/health/live', (_, res) => res.status(204).send());
app.get('/health/ready', (_, res) => res.status(204).send());

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ error: 'An unknown error has occurred' });
});

const wss = new Server({ server, path: '/session' });
wss.on('connection', (ws, req) => {
  (async () => {
    const url = new URL(req.url, 'http://localhost');
    const gameId = url.searchParams.get('game_id').replace(/[*>]/, '');
    const nc = await connect({ servers: NATS_HOST });
    const c = StringCodec();
    const sub = nc.subscribe(`games.${gameId}`);
    // Correct usage of the nats.js client based on their docs
    // https://github.com/nats-io/nats.js/
    // eslint-disable-next-line no-restricted-syntax
    for await (const m of sub) {
      ws.send(c.decode(m.data));
    }
  })().catch(() => {});
});

server.listen(PORT);
