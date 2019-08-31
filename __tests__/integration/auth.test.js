import request from 'supertest';

import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('Auth', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Não deve retornar nada, pois não está autorizado.', async () => {
    const response = await request(app).get('/meetups');

    expect(response.status).toBe(401);
  });

  it('Não deve retornar nada, pois a autorização é inválida..', async () => {
    const user = await factory.attrs('User');

    // cria o usuario
    await request(app)
      .post('/users')
      .send(user);

    // faz o login
    const session = await request(app)
      .post('/sessions')
      .send(user);

    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer xxxx${session.token}`);

    expect(response.status).toBe(401);
  });
});
