import faker from 'faker';
import { factory } from 'factory-girl';

import { addDays } from 'date-fns';
import User from '../src/app/models/User';
import Meetup from '../src/app/models/Meetup';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Meetup', Meetup, {
  title: faker.name.title(),
  description: faker.lorem.paragraph(),
  location: faker.address.streetAddress(true),
  date: addDays(new Date(), 1),
});

export default factory;
