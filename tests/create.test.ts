import {SuperAgentTest} from 'supertest';
import {faker} from '@faker-js/faker';
import TestSetup from './util/setup';

describe('Create', () => {
  const testSetup = new TestSetup();
  let request: SuperAgentTest;

  beforeAll(async () => {
    request = await testSetup.init();
  });
  afterEach(async () => {
    await testSetup.clear();
  });
  afterAll(async () => {
    await testSetup.reset();
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
