import http from 'http';
import { connect } from 'nats';
import { Server } from 'ws';
import app from './src/app';
import GameClient from './src/client';
import { Game } from './genproto/games_pb';

const server = http.createServer(app);
const NATS_HOST = process.env.NATS_HOST || 'localhost';
const PORT = 8000;

const bootstrap = async () => {
  const nc = await connect({ servers: NATS_HOST });
  const wss = new Server({ server, path: '/session' });
  wss.on('connection', (ws, req) => {
    (async () => {
      if (!req.url) {
        throw new Error('Invalid URL');
      }
      const url = new URL(req.url, 'http://localhost');
      const gameId = url.searchParams.get('game_id')?.replace(/[*>]/, '');
      if (!gameId) {
        throw new Error('Invalid game id');
      }
      const sub = nc.subscribe(`games.${gameId}`);
      // Correct usage of the nats.js client based on their docs
      // https://github.com/nats-io/nats.js/
      // eslint-disable-next-line no-restricted-syntax
      for await (const m of sub) {
        const game = Game.deserializeBinary(m.data).toObject();
        ws.send(JSON.stringify(GameClient.mapGame(game)));
      }
      // eslint-disable-next-line no-console
    })().catch((error: unknown) => console.log(error));
  });
};

bootstrap()
  .then(() => server.listen(PORT))
  // eslint-disable-next-line no-console
  .catch((error: unknown) => console.log(error));
