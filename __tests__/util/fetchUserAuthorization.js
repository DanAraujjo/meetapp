import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';

export default async function fetchUserAuthorization() {
  const user = await factory.attrs('User');

  await request(app)
    .post('/users')
    .send(user);

  const response = await request(app)
    .post('/sessions')
    .send(user);

  return response.body.token;
}
