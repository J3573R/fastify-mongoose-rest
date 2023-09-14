import {SuperAgentTest} from 'supertest';
import TestSetup from './util/setup';
import {mockPerson} from './util/mock-data';
import {Person} from './util/models';

describe('Insert many', () => {
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

  it('Should create new documents', async () => {
    const people = [...Array(10)].map(mockPerson);

    const {body} = await request
      .post('/persons/insert-many')
      .expect(200)
      .send(people);

    expect(body.length).toEqual(people.length);

    expect(
      people.every(p1 => body.some((p2: Person) => p2.name === p1.name))
    ).toBe(true);
  });
});
