import { createServer } from 'http';
import { Server } from 'ws';
import app from './src/app';
import register from './src/sockets';

const PORT = 8000;

const server = createServer(app);
const wss = new Server({ server, path: '/session' });
register(wss);
server.listen(PORT);
