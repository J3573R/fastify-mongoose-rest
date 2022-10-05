import {SuperAgentTest} from 'supertest';
import {faker} from '@faker-js/faker';
import TestSetup from './util/setup';

describe('Insert many', () => {
  const testSetup = new TestSetup();
  let request: SuperAgentTest;

  beforeEach(async () => {
    request = await testSetup.init();
  });
  afterEach(async () => {
    await testSetup.reset();
  });

  it('Should create new documents', async () => {
    const names = [
      {name: faker.name.fullName()},
      {name: faker.name.fullName()},
      {name: faker.name.fullName()},
      {name: faker.name.fullName()},
      {name: faker.name.fullName()},
      {name: faker.name.fullName()},
    ];

    await request
      .post('/persons/insert-many')
      .expect(200)
      .send(names)
      .then(res => {
        expect(res.body.length).toEqual(names.length);
        for (let i = 0; i < res.body.length; i++) {
          expect(res.body[i].name).toBe(names[i].name);
        }
      });
  });
});
