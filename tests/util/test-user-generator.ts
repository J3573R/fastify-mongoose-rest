import {faker} from '@faker-js/faker';
import {User, UserModel} from './models';

export default function generateTestUser(overrides: Partial<User> = {}) {
  return UserModel.create({
    name: faker.datatype.number({min: 1, max: 1000}).toString(),
    userId: faker.datatype.number({min: 1, max: 1000}).toString(),
    ...overrides,
  });
}
