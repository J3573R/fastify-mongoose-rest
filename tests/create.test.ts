import {faker} from '@faker-js/faker';
import TestSetup from './util/setup';
import supertest from 'supertest';

describe('Create', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    request = await TestSetup();
  });

  it('should create new document', async () => {
    const name = faker.person.fullName();

    await request
      .post('/persons')
      .expect(200)
      .send({name})
      .then(res => {
        expect(res.body.name).toEqual(name);
      });
  });

  it('should create a new document', async () => {
    const name = faker.person.fullName();
    const userId = faker.string.uuid();

    const {body} = await request
      .post('/users2')
      .expect(200)
      .send({name, userId});

    expect(body).toEqual(expect.objectContaining({name, userId}));
  });
});
