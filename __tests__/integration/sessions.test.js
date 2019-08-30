import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('Sessions', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Não pode se autenticar com dados inválidos', async () => {
    const user = await factory.attrs('User');

    // cria o usuario
    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/sessions')
      .send({ ...user, password: null });

    expect(response.status).toBe(400);
  });

  it('Não pode se autenticar com um e-mail inválido', async () => {
    const user = await factory.attrs('User');

    // cria o usuario
    await request(app)
      .post('/users')
      .send(user);

    // faz o login
    const response = await request(app)
      .post('/sessions')
      .send({
        ...user,
        email: 'invalido@test.com',
      });

    expect(response.status).toBe(401);
  });

  it('Não pode se autenticar com senha errada', async () => {
    const user = await factory.attrs('User');

    // cria o usuario
    await request(app)
      .post('/users')
      .send(user);

    // faz o login
    const response = await request(app)
      .post('/sessions')
      .send({
        ...user,
        password: 'senha-invalida',
      });

    expect(response.status).toBe(401);
  });

  it('Deve poder se autenticar', async () => {
    const user = await factory.attrs('User');

    // cria o usuario
    await request(app)
      .post('/users')
      .send(user);

    // faz o login
    const session = await request(app)
      .post('/sessions')
      .send(user);

    expect(session.body).toHaveProperty('token');
  });
});
