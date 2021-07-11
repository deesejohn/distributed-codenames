import http from 'http';
import { connect, StringCodec } from 'nats';
import { Server } from 'ws';
import app from './app';

const server = http.createServer(app);
const NATS_HOST = process.env.NATS_HOST || '';
const PORT = 8000;

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
