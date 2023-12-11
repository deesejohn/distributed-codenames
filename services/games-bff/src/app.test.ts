import request from 'supertest';
import { NatsConnection } from 'nats';
import app, { gameClient } from './app';

jest.mock<Promise<NatsConnection>>('./subscriber');

test('GET /:game_id/ Success', async () => {
  const id = 'somefakeid';
  const spy = jest.spyOn(gameClient, 'get').mockResolvedValue({
    game_id: id,
    host_id: '',
    blue_team: [],
    blue_team_spymaster: '',
    red_team: [],
    red_team_spymaster: '',
    board: [],
    key: [],
    guessing: '',
    clue: {
      word: '',
      number: 0,
    },
    winner: '',
  });
  await request(app).get(`/${id}/`).expect(200);
  expect(spy).toHaveBeenCalled();
});

test('GET /:game_id/ NotFound', async () => {
  const id = 'somefakeid';
  const spy = jest.spyOn(gameClient, 'get').mockResolvedValue(null);
  await request(app).get(`/${id}/`).expect(404);
  expect(spy).toHaveBeenCalled();
});

test('POST /:game_id/guess NoContent', async () => {
  const id = 'somefakeid';
  const spy = jest.spyOn(gameClient, 'guess').mockResolvedValue();
  await request(app)
    .post(`/${id}/guess`)
    .send({ player_id: 'ziggy-stardust', card_id: 'id' })
    .expect(204);
  expect(spy).toHaveBeenCalled();
});

test('POST /:game_id/hint NoContent', async () => {
  const id = 'somefakeid';
  const spy = jest.spyOn(gameClient, 'hint').mockResolvedValue();
  await request(app)
    .post(`/${id}/hint`)
    .send({ player_id: 'ziggy-stardust', number: 1, word: 'test' })
    .expect(204);
  expect(spy).toHaveBeenCalled();
});

test('POST /:game_id/play_again NoContent', async () => {
  const id = 'somefakeid';
  const spy = jest.spyOn(gameClient, 'playAgain').mockResolvedValue();
  await request(app)
    .post(`/${id}/play_again`)
    .send({ player_id: 'ziggy-stardust' })
    .expect(204);
  expect(spy).toHaveBeenCalled();
});

test('POST /:game_id/skip NoContent', async () => {
  const id = 'somefakeid';
  const spy = jest.spyOn(gameClient, 'skipTurn').mockResolvedValue();
  await request(app)
    .post(`/${id}/skip`)
    .send({ player_id: 'ziggy-stardust' })
    .expect(204);
  expect(spy).toHaveBeenCalled();
});

test('GET /health/live NoContent', async () => {
  await request(app).get(`/health/live`).expect(204);
});

test('GET /health/ready InternalServerError', async () => {
  await request(app).get(`/health/ready`).expect(503);
});
