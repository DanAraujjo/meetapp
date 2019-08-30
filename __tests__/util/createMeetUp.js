import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';

import fileUpload from './fileUpload';

export default async function createMeetUp(token) {
  const meetup = await factory.attrs('Meetup');

  const file = await fileUpload(token);

  const response = await request(app)
    .post('/meetups')
    .set('Authorization', `bearer ${token}`)
    .send({ ...meetup, file_id: file.id });

  return response.body;
}
