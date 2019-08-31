import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';

import fileUpload from './fileUpload';

export default async function createMeetUp(token) {
  const file = await fileUpload(token);

  const meetup = await factory.attrs('Meetup', {
    file_id: file.id,
  });

  const response = await request(app)
    .post('/meetups')
    .set('Authorization', `bearer ${token}`)
    .send({ ...meetup });

  return response.body;
}
