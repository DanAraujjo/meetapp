import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

import createMeetUp from '../util/createMeetUp';

import subscriptionMail from '../../src/app/jobs/SubscriptionMail';

describe('SubscriptionMaill', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Deve poder enviar email após a inscrição.', async () => {
    // owner
    const owner = await factory.attrs('User', {
      email: 'owner@meetap.com',
    });

    await request(app)
      .post('/users')
      .send(owner);

    const sessionOwner = await request(app)
      .post('/sessions')
      .send(owner);

    const meetup = await createMeetUp(sessionOwner.body.token);

    // user
    const user = await factory.attrs('User', {
      email: 'dan.araujjo@gmail.com',
    });

    await request(app)
      .post('/users')
      .send(user);

    const session = await request(app)
      .post('/sessions')
      .send(user);

    await request(app)
      .post(`/meetups/${meetup.id}/subscriptions`)
      .set('Authorization', `bearer ${session.body.token}`);

    const data = {
      meetup: { ...meetup, User: owner },
      user: { ...user },
    };

    const originalHandle = subscriptionMail.handle;

    subscriptionMail.handle = jest.fn(originalHandle);

    await subscriptionMail.handle({ data });

    expect(subscriptionMail.handle).toHaveBeenCalled();
  });
});
