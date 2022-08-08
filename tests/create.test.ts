import {SuperAgentTest} from 'supertest';
import {faker} from '@faker-js/faker';
import TestSetup from './util/setup';

describe('Create', () => {
  const testSetup = new TestSetup();
  let request: SuperAgentTest;

  beforeEach(async () => {
    request = await testSetup.init();
  });
  afterEach(async () => {
    await testSetup.reset();
  });

  it('should create new document', async () => {
    const name = faker.name.findName();

    request
      .post('/persons')
      .expect(200)
      .send({name})
      .then(res => {
        expect(res.body.name).toEqual(name);
      });
  });
});
