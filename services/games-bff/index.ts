import http from 'http';
import { connect } from 'nats';
import { Server } from 'ws';
import app from './src/app';
import register from './src/sockets';

const NATS_HOST = process.env.NATS_HOST || 'localhost';
const PORT = 8000;

(async () => {
  const nc = await connect({ servers: NATS_HOST });
  const server = http.createServer(app);
  const wss = new Server({ server, path: '/session' });
  register(wss, nc);
  server.listen(PORT);
  // eslint-disable-next-line no-console
})().catch(error => console.log(error));
