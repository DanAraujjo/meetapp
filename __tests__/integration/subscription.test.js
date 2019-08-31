import request from 'supertest';
import { addSeconds } from 'date-fns';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';
import fetchOwnerAuthorization from '../util/fetchOwnerAuthorization';
import fetchUserAuthorization from '../util/fetchUserAuthorization';
import createMeetUp from '../util/createMeetUp';
import fileUpload from '../util/fileUpload';

describe('Subscription', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Deve retornar todas as inscrições dos usuario atual.', async () => {
    const tokenOwner = await fetchOwnerAuthorization();
    const meetup = await createMeetUp(tokenOwner);

    const token = await fetchUserAuthorization();

    await request(app)
      .post(`/meetups/${meetup.id}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    const response = await request(app)
      .get('/subscriptions')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('Deve poder se inscrever nos eventos.', async () => {
    const tokenOwner = await fetchOwnerAuthorization();
    const meetup = await createMeetUp(tokenOwner);

    const token = await fetchUserAuthorization();

    const response = await request(app)
      .post(`/meetups/${meetup.id}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('Não deve poder se inscrever em evento que não existe.', async () => {
    const token = await fetchUserAuthorization();

    const response = await request(app)
      .post(`/meetups/${0}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('Não deve poder se inscrever no evento que está organizando.', async () => {
    const tokenOwner = await fetchOwnerAuthorization();
    const meetup = await createMeetUp(tokenOwner);

    const response = await request(app)
      .post(`/meetups/${meetup.id}/subscriptions`)
      .set('Authorization', `bearer ${tokenOwner}`);

    expect(response.status).toBe(400);
  });

  it('Não deve poder se inscrever em evento que já aconteceu.', async () => {
    const tokenOwner = await fetchOwnerAuthorization();

    const file = await fileUpload(tokenOwner);

    const meetup = await factory.attrs('Meetup', {
      date: addSeconds(new Date(), 1),
      file_id: file.id,
    });

    const { body } = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${tokenOwner}`)
      .send({ ...meetup });

    await new Promise(r => setTimeout(r, 1000));

    const token = await fetchUserAuthorization();

    const response = await request(app)
      .post(`/meetups/${body.id}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('Não deve poder se inscrever em eventos no mesmo horário.', async () => {
    const tokenOwner = await fetchOwnerAuthorization();

    const file = await fileUpload(tokenOwner);
    const meetup = await factory.attrs('Meetup', {
      file_id: file.id,
    });

    // meetup 1
    const meetup01 = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${tokenOwner}`)
      .send({
        ...meetup,
        title: 'Meetup 01',
      });

    // meetup 2
    const meetup02 = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${tokenOwner}`)
      .send({
        ...meetup,
        title: 'Meetup 02',
      });

    // token do usuário
    const token = await fetchUserAuthorization();

    // inscrição do meetup 1
    await request(app)
      .post(`/meetups/${meetup01.body.id}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    // inscrição do meetup 2
    const response = await request(app)
      .post(`/meetups/${meetup02.body.id}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('Deve poder cancelar uma inscrição.', async () => {
    const tokenOwner = await fetchOwnerAuthorization();
    const meetup = await createMeetUp(tokenOwner);

    const token = await fetchUserAuthorization();

    await request(app)
      .post(`/meetups/${meetup.id}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    const response = await request(app)
      .delete(`/meetups/${meetup.id}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('Não deve poder cancelar uma inscrição de evento que não existe.', async () => {
    const token = await fetchUserAuthorization();

    const response = await request(app)
      .delete(`/meetups/${0}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('Não deve poder cancelar uma inscrição de evento que já aconteceu.', async () => {
    const tokenOwner = await fetchOwnerAuthorization();

    const file = await fileUpload(tokenOwner);

    const meetup = await factory.attrs('Meetup', {
      date: addSeconds(new Date(), 1),
      file_id: file.id,
    });

    const { body } = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${tokenOwner}`)
      .send({ ...meetup });

    await new Promise(r => setTimeout(r, 1000));

    const token = await fetchUserAuthorization();

    const response = await request(app)
      .delete(`/meetups/${body.id}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('Não deve poder cancelar uma inscrição que não foi realizada.', async () => {
    const tokenOwner = await fetchOwnerAuthorization();

    const meetup = await createMeetUp(tokenOwner);

    const token = await fetchUserAuthorization();

    const response = await request(app)
      .delete(`/meetups/${meetup.id}/subscriptions`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
