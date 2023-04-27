import {SuperAgentTest} from 'supertest';
import TestSetup from './util/setup';
import {PersonModel, UserModel} from './util/models';
import generateTestUser from './util/test-user-generator';

describe('Delete', () => {
  const testSetup = new TestSetup();
  let request: SuperAgentTest;

  beforeEach(async () => {
    request = await testSetup.init();
  });
  afterEach(async () => {
    await testSetup.reset();
  });

  it('should delete a document', async () => {
    const personA = await PersonModel.create({name: 'a'});
    const personB = await PersonModel.create({name: 'b'});
    const personC = await PersonModel.create({name: 'c'});
    await request.delete(`/persons/${personA._id}`).expect(200);
    let testA = await PersonModel.findById(`${personA._id}`);
    let testB = await PersonModel.findById(`${personB._id}`);
    let testC = await PersonModel.findById(`${personC._id}`);
    expect(testA).toBeFalsy();
    expect(testB).toBeTruthy();
    expect(testC).toBeTruthy();
    await request.delete(`/persons/${personC._id}`).expect(200);
    testA = await PersonModel.findById(`${personA._id}`);
    testB = await PersonModel.findById(`${personB._id}`);
    testC = await PersonModel.findById(`${personC._id}`);
    expect(testA).toBeFalsy();
    expect(testB).toBeTruthy();
    expect(testC).toBeFalsy();
  });
  it('should return error 404 if given id is not found from database ', async () => {
    await request.delete('/persons/123456abcdef123456abcdef').expect(404);
  });
  it('should delete document by userId', async () => {
    const user1 = await generateTestUser();
    const user2 = await generateTestUser();
    await request
      .delete(`/users/${user1.userId}`)
      .expect(200)
      .expect('Content-Type', /json/);
    const testA = await UserModel.findById(user1._id);
    const testB = await UserModel.findById(user2._id);
    expect(testA).toBeFalsy();
    expect(testB).toBeTruthy();
  });
});
