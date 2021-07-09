import {SuperAgentTest} from 'supertest';
import faker from 'faker';
import TestSetup from './util/setup';
import {PersonModel} from './util/models';

describe(`list`, () => {
  const testSetup = new TestSetup();
  let request: SuperAgentTest;

  beforeEach(async () => {
    request = await testSetup.init();
  });

  afterEach(async () => {
    await testSetup.reset();
  });

  it('should get list of documents', async () => {
    const personCount = faker.datatype.number({min: 1, max: 10});
    for (let i = 0; i < personCount; i++) {
      await PersonModel.create({name: faker.name.findName()});
    }
    await request
      .get('/persons')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(({body}) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body.length).toEqual(personCount);
      });
  });
  it.todo('should get list of documents with skip and limit');
  it.todo('should get list of documents with filter');
  it.todo('should populate list elements');

  it.todo('should sort list documents');

  it.todo('should return header X-Total-Count with total count of documents');

  it.todo('should return only properties defined in projection');
});
