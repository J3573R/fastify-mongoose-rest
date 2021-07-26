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

  it('should be able to modify only one subdocument property', async () => {
    const person = await PersonModel.create({
      name: 'asd',
      address: {
        street: 'Keskuojankatu',
        city: 'Tampere',
      },
    });
    const changes = {
      name: 'qwe',
      address: {
        street: 'Jasperintie',
      },
    };
    return request
      .patch(`/persons/${person._id}`)
      .expect(200)
      .send(changes)
      .then(async ({body}) => {
        expect(body.name).toEqual('qwe');
        expect(body.address.city).toEqual('Tampere');
        expect(body.address.street).toEqual('Jasperintie');

        const updatedPerson = await PersonModel.findById(person._id);
        expect(updatedPerson).toMatchObject(changes);
      });
  });

  it('should be able to add non-existing properties if in schema', async () => {
    const person = await PersonModel.create({
      name: 'asd',
    });
    return request
      .patch(`/persons/${person._id}`)
      .expect(200)
      .send({motto: 'Hello World'})
      .then(async ({body}) => {
        expect(body.motto).toEqual('Hello World');
        const updatedPerson = await PersonModel.findById(person._id);
        expect(updatedPerson).toHaveProperty('motto', 'Hello World');
      });
  });
});
