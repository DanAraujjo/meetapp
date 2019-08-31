import request from 'supertest';
import app from '../../src/app';

import truncate from '../util/truncate';
import fetchOwnerAuthorization from '../util/fetchOwnerAuthorization';
import createMeetUp from '../util/createMeetUp';

describe('Organizing', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Deve retornar todos os eventos organizado pelo usuario atual', async () => {
    const token = await fetchOwnerAuthorization();

    await createMeetUp(token);
    await createMeetUp(token);

    const response = await request(app)
      .get('/organizing')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
