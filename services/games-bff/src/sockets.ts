import { NatsConnection } from 'nats';
import { URL } from 'url';
import WebSocket, { Server } from 'ws';
import GameClient from './client';
import { Game } from '../genproto/games_pb';

const register = (wss: Server<WebSocket.WebSocket>, nc: NatsConnection) => {
  wss.on('connection', (ws, req) => {
    (async () => {
      if (!req.url) {
        throw new Error('Bad request format: invalid url');
      }
      const url = new URL(req.url, 'http://localhost');
      const gameId = url.searchParams.get('game_id')?.replace(/[*>]/, '');
      if (!gameId) {
        throw new Error('Missing required query parameter: game_id');
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

export default register;
