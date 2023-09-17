import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import app from './src/app';
import register from './src/sockets';

const PORT = 8000;

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/session' });
register(wss);
server.listen(PORT);
