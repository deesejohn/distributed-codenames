import { NatsConnection, connect } from 'nats';
import GameClient from './client';
import { Game } from '../genproto/games_pb';

const NATS_HOST = process.env.NATS_HOST || 'localhost';

export const connection: Promise<NatsConnection> = connect({
  servers: NATS_HOST,
});

export async function* subscribe(gameId: string) {
  const nc = await connection;
  const sub = nc.subscribe(`games.${gameId}`);
  // Correct usage of the nats.js client based on their docs
  // https://github.com/nats-io/nats.js/
  // eslint-disable-next-line no-restricted-syntax
  for await (const m of sub) {
    const game = Game.deserializeBinary(m.data).toObject();
    yield GameClient.mapGame(game);
  }
}
