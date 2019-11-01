import request from 'supertest';
import { resolve } from 'path';
import app from '../../src/app';

export default async function uploadFile(token) {
  const response = await request(app)
    .post('/files')
    .attach('file', resolve(__dirname, 'gostack.jpg'))
    .set('Authorization', `bearer ${token}`);

  return response.body;
}
