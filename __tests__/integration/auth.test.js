import request from 'supertest';

import app from '../../src/app';

import truncate from '../util/truncate';

describe('Auth', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Não deve retornar nada, pois o token não foi informado.', async () => {
    const response = await request(app).get('/meetups');

    expect(response.status).toBe(401);
  });

  it('Não deve retornar nada, pois o token é inválido.', async () => {
    const response = await request(app)
      .get('/meetups')
      .set('Authorization', `bearer token-invalido.`);

    expect(response.status).toBe(401);
  });
});
