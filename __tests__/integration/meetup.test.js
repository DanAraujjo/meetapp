import request from 'supertest';
import { subDays, addSeconds } from 'date-fns';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';
import fetchUserAuthorization from '../util/fetchUserAuthorization';
import createMeetUp from '../util/createMeetUp';
import fileUpload from '../util/fileUpload';

describe('Meetup', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Deve retornar todos os eventos', async () => {
    const token = await fetchUserAuthorization();

    await createMeetUp(token);

    const response = await request(app)
      .get('/meetups')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('Deve retornar todos os eventos de uma data especifica', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await factory.attrs('Meetup', {
      date: new Date(),
    });

    const file = await fileUpload(token);

    await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup, file_id: file.id });

    const response = await request(app)
      .get('/meetups')
      .set('Authorization', `bearer ${token}`)
      .query({ date: new Date() });

    expect(response.status).toBe(200);
  });

  it('Deve poder criar eventos', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await factory.attrs('Meetup');

    const file = await fileUpload(token);

    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup, file_id: file.id });

    expect(response.status).toBe(201);
  });

  it('Não deve poder criar eventos com datas passadas', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await factory.attrs('Meetup', {
      date: subDays(new Date(), 1),
    });

    const file = await fileUpload(token);

    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup, file_id: file.id });

    expect(response.status).toBe(400);
  });

  it('Não deve poder criar eventos faltando informações', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await factory.attrs('Meetup', {
      title: null,
    });

    const file = await fileUpload(token);

    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup, file_id: file.id });

    expect(response.status).toBe(400);
  });

  it('Deve poder atualizar o evento', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await createMeetUp(token);

    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup, title: 'Novo nome' });

    expect(response.status).toBe(200);
  });

  it('Não deve poder atualizar o evento com informações inválidas', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await createMeetUp(token);

    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup, title: null });

    expect(response.status).toBe(400);
  });

  it('Não deve poder atualizar o evento com uma data passada', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await createMeetUp(token);

    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup, date: subDays(new Date(), 1) });

    expect(response.status).toBe(400);
  });

  it('Não deve poder atualizar o evento que não existe', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await createMeetUp(token);

    const response = await request(app)
      .put(`/meetups/${0}`)
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup });

    expect(response.status).toBe(404);
  });

  it('Não deve poder atualizar o evento que já aconteceu', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await factory.attrs('Meetup', {
      date: addSeconds(new Date(), 1),
    });

    const file = await fileUpload(token);

    const { body } = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup, file_id: file.id });

    await new Promise(r => setTimeout(r, 1000));

    const response = await request(app)
      .put(`/meetups/${body.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ title: 'Novo titulo' });

    expect(response.status).toBe(400);
  });

  it('Deve poder cancelar o evento', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await createMeetUp(token);

    const response = await request(app)
      .delete(`/meetups/${meetup.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('Não deve poder cancelar um evento que não existe', async () => {
    const token = await fetchUserAuthorization();

    const response = await request(app)
      .delete(`/meetups/${0}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('Não deve poder cancelar um evento que já aconteceu', async () => {
    const token = await fetchUserAuthorization();

    const meetup = await factory.attrs('Meetup', {
      date: addSeconds(new Date(), 1),
    });

    const file = await fileUpload(token);

    const { body } = await request(app)
      .post('/meetups')
      .set('Authorization', `bearer ${token}`)
      .send({ ...meetup, file_id: file.id });

    await new Promise(r => setTimeout(r, 1000));

    const response = await request(app)
      .delete(`/meetups/${body.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
