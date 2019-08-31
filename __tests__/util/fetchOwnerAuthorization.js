import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';

export default async function createUser() {
  const user = await factory.attrs('User', { email: 'owner@meetapp.com' });

  await request(app)
    .post('/users')
    .send(user);

  const session = await request(app)
    .post('/sessions')
    .send(user);

  return session.body.token;
}
