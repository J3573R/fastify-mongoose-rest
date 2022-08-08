import {SuperAgentTest} from 'supertest';
import {faker} from '@faker-js/faker';
import TestSetup from './util/setup';
import {CatModel, PersonModel} from './util/models';

describe('details', () => {
  const testSetup = new TestSetup();
  let request: SuperAgentTest;

  beforeEach(async () => {
    request = await testSetup.init();
  });

  afterEach(async () => {
    await testSetup.reset();
  });

  it('should return document', async () => {
    const person = await PersonModel.create({name: 'asd'});
    await request
      .get(`/persons/${person._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(({body}) => {
        expect(body).toHaveProperty('name', 'asd');
      });
  });

  it('should populate information to returned document', async () => {
    const catCount = faker.datatype.number({min: 1, max: 10});
    const cats = [];
    for (let i = 0; i < catCount; i++) {
      const {_id} = await CatModel.create({
        name: faker.name.findName(),
        age: faker.datatype.number({min: 1, max: 20}),
      });
      cats.push(_id);
    }
    const person = await PersonModel.create({name: 'asd', cats});
    await request
      .get(`/persons/${person._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .query({populate: 'cats'})
      .then(({body}) => {
        expect(body).toHaveProperty('name', 'asd');
        expect(body).toHaveProperty('cats');
        expect(body.cats.length).toEqual(catCount);
      });
  });

  it('should return only properties defined in projection', async () => {
    const person = await PersonModel.create({name: faker.name.findName()});
    await request
      .get(`/persons/${person._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .query({
        projection: 'name -_id',
      })
      .then(({body}) => {
        expect(body).toHaveProperty('name');
        expect(body).not.toHaveProperty('_id');
      });
  });

  it('should parse comma separated parameters defined in projection', async () => {
    const person = await PersonModel.create({name: faker.name.findName()});
    await request
      .get(`/persons/${person._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .query({
        projection: 'name,-_id',
      })
      .then(({body}) => {
        expect(body).toHaveProperty('name');
        expect(body).not.toHaveProperty('_id');
      });
  });

  it('should return only properties defined in select', async () => {
    const person = await PersonModel.create({name: faker.name.findName()});
    await request
      .get(`/persons/${person._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .query({
        select: 'name -_id',
      })
      .then(({body}) => {
        expect(body).toHaveProperty('name');
        expect(body).not.toHaveProperty('_id');
      });
  });

  it('should parse comma separated parameters defined in select', async () => {
    const person = await PersonModel.create({name: faker.name.findName()});
    await request
      .get(`/persons/${person._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .query({
        select: 'name,-_id',
      })
      .then(({body}) => {
        expect(body).toHaveProperty('name');
        expect(body).not.toHaveProperty('_id');
      });
  });
});
