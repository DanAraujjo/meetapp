import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  // #region create
  it('Deve poder se registar', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('Deve criptografar a senha do usuário quando o mesmo for criado', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('Não deve poder se registar sem informar o nome.', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({ ...user, name: null });

    expect(response.status).toBe(400);
  });

  it('Não deve poder se registar sem informar o email.', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({ ...user, email: null });

    expect(response.status).toBe(400);
  });

  it('Não deve poder se registar com um e-mail já utilizado (duplicado).', async () => {
    const user1 = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user1);

    const user2 = await factory.attrs('User');
    const response = await request(app)
      .post('/users')
      .send({ ...user2, email: user1.email });

    expect(response.status).toBe(400);
  });

  it('Não deve poder se registar sem informar a senha.', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({ ...user, password: null });

    expect(response.status).toBe(400);
  });

  it('A senha não deve ter menos de 6 digitos.', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({ ...user, password: '12345' });

    expect(response.status).toBe(400);
  });

  // #endregion

  // #region update

  it('Deve ser possivel atualizar.', async () => {
    const user = await factory.attrs('User', { password: '123456' });

    // cria o usuario
    await request(app)
      .post('/users')
      .send(user);

    // faz o login
    const session = await request(app)
      .post('/sessions')
      .send(user);

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${session.body.token}`)
      .send({
        name: 'Novo nome',
        email: `${user.email}`,
        oldPassword: '123456',
        password: '654321',
        confirmPassword: '654321',
      });

    expect(response.status).toBe(200);
  });

  it('Não deve poder atualizar sem informar o email.', async () => {
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
      .put('/users')
      .set('Authorization', `bearer ${session.body.token}`)
      .send({ ...user, email: null });

    expect(response.status).toBe(400);
  });

  it('Não deve poder atualizar a senha se a senha atual for diferente da informada.', async () => {
    const user = await factory.attrs('User', { password: '123456' });

    // cria o usuario
    await request(app)
      .post('/users')
      .send(user);

    // faz o login
    const session = await request(app)
      .post('/sessions')
      .send(user);

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${session.body.token}`)
      .send({
        ...user,
        oldPassword: 'senha-diferente',
        password: '123456',
        confirmPassword: '123456',
      });

    expect(response.status).toBe(401);
  });

  it('Não deve poder atualizar a senha sem informa a senha atual.', async () => {
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
      .put('/users')
      .set('Authorization', `bearer ${session.body.token}`)
      .send({
        ...user,
        oldPassword: null,
        password: '123456',
        confirmPassword: '123456',
      });

    expect(response.status).toBe(400);
  });

  it('Não deve poder atualizar a senha sem informa confirmacão de nova senha.', async () => {
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
      .put('/users')
      .set('Authorization', `bearer ${session.body.token}`)
      .send({
        ...user,
        oldPassword: user.password,
        password: '123456',
        confirmPassword: null,
      });

    expect(response.status).toBe(400);
  });

  it('Não deve poder atualizar a senha se a mesma tiver menos de 6 digitos.', async () => {
    const user = await factory.attrs('User', { password: '123456' });

    // cria o usuario
    await request(app)
      .post('/users')
      .send(user);

    // faz o login
    const session = await request(app)
      .post('/sessions')
      .send(user);

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${session.body.token}`)
      .send({
        ...user,
        oldPassword: user.password,
        password: '123',
        confirmPassword: '123',
      });

    expect(response.status).toBe(400);
  });

  it('Não deve poder atualizar com um e-mail já utilizado (duplicado).', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send({ ...user, password: '123456' });

    await request(app)
      .post('/users')
      .send({ ...user, email: 'test@test.com' });

    const session = await request(app)
      .post('/sessions')
      .send({ ...user, password: '123456' });

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${session.body.token}`)
      .send({ email: 'test@test.com' });

    expect(response.status).toBe(400);
  });

  // #endregion
});
