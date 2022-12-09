import { URL } from 'url';
import { WebSocket, Server } from 'ws';
import { subscribe } from './subscriber';

const register = (wss: Server<WebSocket>) => {
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
      // eslint-disable-next-line no-restricted-syntax
      for await (const update of subscribe(gameId)) {
        ws.send(JSON.stringify(update));
      }
      // eslint-disable-next-line no-console
    })().catch((error: unknown) => console.log(error));
  });
};

export default register;
