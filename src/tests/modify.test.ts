import {SuperAgentTest} from 'supertest';
import TestSetup from './util/setup';
import {PersonModel} from './util/models';

describe('Modify', () => {
  const testSetup = new TestSetup();
  let request: SuperAgentTest;

  beforeEach(async () => {
    request = await testSetup.init();
  });
  afterEach(async () => {
    await testSetup.reset();
  });

  it('should modify existing document', async () => {
    const person = await PersonModel.create({name: 'asd'});
    return request
      .patch(`/persons/${person._id}`)
      .expect(200)
      .send({name: 'qwe'})
      .then(res => {
        expect(res.body.name).toEqual('qwe');
      });
  });
});
