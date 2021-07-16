import {SuperAgentTest} from 'supertest';
import faker from 'faker';
import TestSetup from './util/setup';
import {CatModel, PersonModel} from './util/models';

describe('search', () => {
  const testSetup = new TestSetup();
  let request: SuperAgentTest;

  beforeEach(async () => {
    request = await testSetup.init();
  });

  afterEach(async () => {
    await testSetup.reset();
  });

  it('should return list of documents', async () => {
    const personCount = faker.datatype.number({min: 1, max: 10});
    for (let i = 0; i < personCount; i++) {
      await PersonModel.create({name: faker.name.findName()});
    }
    await request
      .post('/persons/search')
      .expect(200)
      .expect('Content-Type', /json/)
      .send({})
      .then(({body}) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body.length).toEqual(personCount);
      });
  });
  it('should return list of documents with skip and limit', async () => {
    for (let i = 0; i <= 2; i++) {
      await PersonModel.create({name: faker.name.findName()});
    }
    await request
      .post('/persons/search')
      .expect(200)
      .expect('Content-Type', /json/)
      .send({skip: 1, limit: 5})
      .then(({body}) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body.length).toEqual(2);
      });
  });
  it('should return specific list of documents with filter', async () => {
    const person = await PersonModel.create({name: 'asd'});
    await PersonModel.create({name: 'qwe'});

    await request
      .post('/persons/search')
      .expect(200)
      .expect('Content-Type', /json/)
      .send({query: {name: 'asd'}})
      .then(({body}) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body.length).toEqual(1);
        expect(body[0].name).toEqual(person.name);
      });
  });
  it('should populate information to returned documents', async () => {
    const catCount = faker.datatype.number({min: 1, max: 10});
    const cats = [];
    for (let i = 0; i < catCount; i++) {
      const {_id} = await CatModel.create({
        name: faker.name.findName(),
        age: faker.datatype.number({min: 1, max: 20}),
      });
      cats.push(_id);
    }
    await PersonModel.create({name: 'asd', cats});
    await request
      .post('/persons/search')
      .expect(200)
      .expect('Content-Type', /json/)
      .send({populate: 'cats'})
      .then(({body}) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body.length).toEqual(1);
        expect(Array.isArray(body[0].cats)).toEqual(true);
        expect(body[0].cats.length).toEqual(catCount);
      });
  });

  it('should sort returned documents', async () => {
    await PersonModel.create({name: 'a'});
    await PersonModel.create({name: 'b'});
    await PersonModel.create({name: 'c'});

    await request
      .post('/persons/search')
      .expect(200)
      .expect('Content-Type', /json/)
      .send({sort: 'name'})
      .then(({body}) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body.length).toEqual(3);
        expect(body[0].name).toEqual('a');
        expect(body[1].name).toEqual('b');
        expect(body[2].name).toEqual('c');
      });
    await request
      .post('/persons/search')
      .expect(200)
      .expect('Content-Type', /json/)
      .send({sort: '-name'})
      .then(({body}) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body.length).toEqual(3);
        expect(body[2].name).toEqual('a');
        expect(body[1].name).toEqual('b');
        expect(body[0].name).toEqual('c');
      });
  });

  it('should return header X-Total-Count with total count of documents', async () => {
    for (let i = 0; i < 10; i++) {
      await PersonModel.create({name: faker.name.findName()});
    }
    await request
      .post('/persons/search')
      .expect(200)
      .expect('Content-Type', /json/)
      .send({skip: 0, limit: 5})
      .then(({body, header}) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body.length).toEqual(5);
        expect(header['x-total-count']).toEqual('10');
      });
  });

  it('should return only properties defined in projection', async () => {
    await PersonModel.create({name: faker.name.findName()});
    await request
      .post('/persons/search')
      .expect(200)
      .expect('Content-Type', /json/)
      .send({
        projection: 'name -_id',
      })
      .then(({body}) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body.length).toEqual(1);
        expect(body[0]).toHaveProperty('name');
        expect(body[0]).not.toHaveProperty('_id');
      });
  });
});
