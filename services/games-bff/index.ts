import express from 'express';
import { json } from 'body-parser';
import http from 'http';
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
  Player as GrpcPlayer,
  SkipTurnRequest
} from './genproto/games_pb';
import {
  Card,
  Game,
  Player
} from 'models';

const
  app = express(),
  server = http.createServer(app);
const
  GAMES_HOST = process.env.GAMES_HOST || 'localhost:4000',
  NATS_HOST = process.env.NATS_HOST || '',
  PORT = 8000;

const gameClient = new GamesServiceClient(
  GAMES_HOST,
  grpc.credentials.createInsecure()
);

function mapCard(dto: GrpcCard.AsObject): Card {
  return {
    card_id: dto.cardId,
    label: dto.label,
    color: dto.color,
    revealed: dto.revealed
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
    winner: dto.winner
  };
}

function mapPlayer(dto: GrpcPlayer.AsObject): Player {
  return {
    player_id: dto.playerId,
    nickname: dto.nickname
  };
}

app.use(json());

app.get('/:game_id/', (req, res) => {
  let request = new GetGameRequest();
  request.setGameId(req.params.game_id);
  gameClient.getGame(request, (err, data) => {
    if (err) throw err;
    const response = data?.getGame().toObject();
    res.send(mapGame(response));
  });
});

app.post('/:game_id/guess', (req, res) => {
  let request = new GuessRequest();
  request.setGameId(req.params.game_id);
  request.setPlayerId(req.body.player_id);
  request.setCardId(req.body.card_id);
  gameClient.guess(request, (err, data) => {
    if (err) {
      res.status(400).send();
      return;
    };
    res.status(204).send();
  });
});

app.post('/:game_id/hint', (req, res) => {
  let request = new HintRequest();
  request.setGameId(req.params.game_id);
  request.setPlayerId(req.body.player_id);
  let clue = new GrpcClue();
  clue.setNumber(req.body.number);
  clue.setWord(req.body.word);
  request.setClue(clue);
  gameClient.hint(request, (err, data) => {
    if (err) {
      res.status(400).send();
      return;
    };
    res.status(204).send();
  });
});

app.post('/:game_id/skip', (req, res) => {
  let request = new SkipTurnRequest();
  request.setGameId(req.params.game_id);
  request.setPlayerId(req.body.player_id);
  gameClient.skipTurn(request, (err, data) => {
    if (err) {
      res.status(400).send();
      return;
    };
    res.status(204).send();
  });
});

app.get('/health/live', (_, res) => res.status(204).send());
app.get('/health/ready', (_, res) => res.status(204).send());

const wss = new Server({ server: server, path: '/session' });
wss.on('connection', (ws, req) => {
  (async () => {
    const url = new URL(req.url, 'http://localhost');
    const game_id = url.searchParams.get('game_id').replace(/[\*\>]/, '');
    const nc = await connect({ servers: NATS_HOST });
    const c = StringCodec();
    const sub = nc.subscribe(`games.${game_id}`);
    for await (const m of sub) {
      ws.send(c.decode(m.data));
    };
  })().catch(console.log);
});

server.listen(PORT, () => console.log('[server]: Server is running'));