import {faker} from '@faker-js/faker';
import {User, UserModel, Person, PersonModel, Cat, CatModel} from './models';
import {Types} from 'mongoose';

const mockUser = (overrides: Partial<User> = {}): User => ({
  name: faker.person.fullName(),
  userId: faker.string.uuid(),
  ...overrides,
});

export const createMockUser = async (overrides: Partial<User> = {}) => {
  return UserModel.create(mockUser(overrides));
};

export const createMultipleMockUsers = async (count: number) => {
  return Promise.all([...Array(count)].map(() => createMockUser()));
};

export const mockPerson = (overrides: Partial<Person> = {}): Person => ({
  name: faker.person.fullName(),
  motto: faker.lorem.sentence(),
  address: {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
  },
  ...overrides,
});

export const createMockPerson = async (overrides: Partial<Person> = {}) => {
  return PersonModel.create(mockPerson(overrides));
};

export const createMultipleMockPersons = async (count: number) => {
  return Promise.all([...Array(count)].map(() => createMockPerson()));
};

const mockCat = (overrides: Partial<Cat> = {}): Cat => ({
  name: faker.person.firstName(),
  age: faker.number.int({min: 1, max: 20}),
  owner: new Types.ObjectId(),
  ...overrides,
});

export const createMockCat = async (overrides: Partial<Cat> = {}) => {
  return CatModel.create(mockCat(overrides));
};

export const createMultipleMockCats = async (
  count: number,
  owner?: Types.ObjectId
) => {
  return Promise.all([...Array(count)].map(() => createMockCat({owner})));
};
