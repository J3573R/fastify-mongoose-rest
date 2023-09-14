import {SuperAgentTest} from 'supertest';
import TestSetup from './util/setup';
import {createMockPerson, createMockUser} from './util/mock-data';
import {faker} from '@faker-js/faker';
import {Types} from 'mongoose';

describe('Modify', () => {
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

  it('should modify existing document', async () => {
    const person = await createMockPerson();

    const {body} = await request
      .patch(`/persons/${person._id}`)
      .expect(200)
      .send({name: 'qwe'});

    expect(body).toEqual(
      expect.objectContaining({
        name: 'qwe',
        motto: person.motto,
        address: person.address,
      })
    );
  });

  it('should be able to modify only one sub document property', async () => {
    const person = await createMockPerson();

    const street = faker.location.streetAddress();

    const {body} = await request
      .patch(`/persons/${person._id}`)
      .expect(200)
      .send({address: {street}});

    expect(body).toEqual(
      expect.objectContaining({
        name: person.name,
        motto: person.motto,
        address: {
          street,
          city: person.address.city,
        },
      })
    );
  });

  it('should be able to add non-existing properties if in schema', async () => {
    const person = await createMockPerson({
      motto: undefined,
    });

    const motto = faker.lorem.sentence();

    const {body} = await request
      .patch(`/persons/${person._id}`)
      .expect(200)
      .send({motto});

    expect(body).toEqual(
      expect.objectContaining({
        name: person.name,
        motto,
        address: person.address,
      })
    );
  });

  it('should not be able to add non-existing properties if not in schema', async () => {
    const person = await createMockPerson();

    const favoriteFood = faker.lorem.sentence();

    const {body} = await request
      .patch(`/persons/${person._id}`)
      .expect(200)
      .send({favoriteFood});

    expect(body).not.toHaveProperty('favoriteFood');
  });

  it('should not be able to modify userId', async () => {
    const user = await createMockUser();

    const name = faker.person.fullName();

    const {body} = await request
      .patch(`/users/${user.userId}`)
      .expect(200)
      .send({name});

    expect(body).toEqual(
      expect.objectContaining({
        name,
        userId: user.userId,
      })
    );
  });

  it('should return 404 if resource not found', async () => {
    const {body} = await request
      .patch(`/persons/${new Types.ObjectId()}`)
      .expect(404)
      .send({name: 'qwe'});

    expect(body).toEqual(
      expect.objectContaining({
        message: 'Resource not found',
      })
    );
  });
});
