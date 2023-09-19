import {faker} from '@faker-js/faker';
import TestSetup from './util/setup';
import mongoose from 'mongoose';
import {
  createMockCat,
  createMockPerson,
  createMultipleMockCats,
  createMultipleMockUsers,
} from './util/mock-data';
import supertest from 'supertest';

describe('details', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    request = await TestSetup();
  });

  it('should return document', async () => {
    const person = await createMockPerson();

    const {body} = await request
      .get(`/persons/${person._id}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(body).toHaveProperty('name', person.name);
  });

  it('should return document by userId', async () => {
    const [user] = await createMultipleMockUsers(3);

    const {body} = await request
      .get(`/users/${user.userId}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(body).toHaveProperty('name', user.name);
    expect(body).toHaveProperty('userId', user.userId);
  });

  it('should populate information to returned document', async () => {
    const person = await createMockPerson();

    const cats = await createMultipleMockCats(
      faker.number.int({min: 1, max: 10}),
      person._id
    );

    const {body} = await request
      .get(`/persons/${person._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .query({populate: 'cats'});

    expect(body).toHaveProperty('name', person.name);
    expect(body).toHaveProperty('cats');
    expect(body.cats.length).toEqual(cats.length);
  });

  it('should populate information with object to returned document', async () => {
    const person = await createMockPerson();

    const cat = await createMockCat({
      owner: person._id,
    });

    const {body} = await request
      .get(`/cats/${cat._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .query({
        populate: JSON.stringify({
          path: 'owner',
        }),
      });

    expect(body).toHaveProperty('name', cat.name);
    expect(body).toHaveProperty('owner');
    expect(body.owner).toHaveProperty('name', person.name);
  });

  const projectionTests = [
    ['should return only properties defined in projection string', 'name -_id'],
    [
      'should parse comma separated parameters defined in projection string',
      'name,-_id',
    ],
    [
      'should parse object defined parameter in projection string',
      JSON.stringify({
        name: 1,
        _id: 0,
      }),
    ],
  ];

  test.each(projectionTests)('%s', async (_, projection) => {
    const person = await createMockPerson();

    const {body} = await request
      .get(`/persons/${person._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .query({
        projection,
      });

    expect(body).toHaveProperty('name', person.name);
    expect(body).not.toHaveProperty('_id');
  });

  const selectTests = [
    ['should return only properties defined in select string', 'name -_id'],
    [
      'should parse comma separated parameters defined in select string',
      'name,-_id',
    ],
    [
      'should parse object defined parameter in select string',
      JSON.stringify({
        name: 1,
        _id: 0,
      }),
    ],
  ];

  test.each(selectTests)('%s', async (_, select) => {
    const person = await createMockPerson();

    const {body} = await request
      .get(`/persons/${person._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .query({
        select,
      });

    expect(body).toHaveProperty('name', person.name);
    expect(body).not.toHaveProperty('_id');
  });

  it('should return error 404 if document by given id is not found from database', async () => {
    await request.get(`/persons/${new mongoose.Types.ObjectId()}`).expect(404);
  });
});
