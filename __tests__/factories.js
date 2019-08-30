import faker from 'faker/locale/pt_BR';
import { factory } from 'factory-girl';

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
  date: faker.date.recent(5),
});

export default factory;
