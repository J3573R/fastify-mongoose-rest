import {SuperAgentTest} from 'supertest';
import TestSetup from './util/setup';
import {PersonModel, UserModel} from './util/models';
import {
  createMultipleMockPersons,
  createMultipleMockUsers,
} from './util/mock-data';
import {Types} from 'mongoose';

describe('Delete', () => {
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

  it('should delete a document', async () => {
    const people = await createMultipleMockPersons(3);

    await request.delete(`/persons/${people[0]._id}`).expect(200);
    const people1 = await PersonModel.find();
    expect(people1).toHaveLength(2);
    expect(people1.find(p => p._id === people[0]._id)).toBeFalsy();

    await request.delete(`/persons/${people[2]._id}`).expect(200);
    const people2 = await PersonModel.find();
    expect(people2).toHaveLength(1);
    expect(people2.find(p => p._id === people[2]._id)).toBeFalsy();
  });

  it('should return error 404 if given id is not found from database ', async () => {
    await request.delete(`/persons/${new Types.ObjectId()}`).expect(404);
  });

  it('should delete document by userId', async () => {
    const users = await createMultipleMockUsers(3);

    await request.delete(`/users/${users[0].userId}`).expect(200);
    const users1 = await UserModel.find();
    expect(users1).toHaveLength(2);
    expect(users1.find(u => u.userId === users[0].userId)).toBeFalsy();
  });
});
