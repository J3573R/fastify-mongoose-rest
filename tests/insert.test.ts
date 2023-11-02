import TestSetup from './util/setup';
import {mockPerson} from './util/mock-data';
import {Person} from './util/models';
import supertest from 'supertest';

describe('Insert many', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    request = await TestSetup();
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
