import {SuperAgentTest} from 'supertest';
import {faker} from '@faker-js/faker';
import TestSetup from './util/setup';
import {CatModel, PersonModel} from './util/models';

describe('search', () => {
  describe('endpoint', () => {
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
    it('should return specific list of documents with "query" filter', async () => {
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

    it('should return specific list of documents with "q" filter', async () => {
      const person = await PersonModel.create({name: 'asd'});
      await PersonModel.create({name: 'qwe'});

      await request
        .post('/persons/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({q: {name: 'asd'}})
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

    it('should parse comma separated parameters defined in projection', async () => {
      await PersonModel.create({name: faker.name.findName()});
      await request
        .post('/persons/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({
          projection: 'name,-_id',
        })
        .then(({body}) => {
          expect(Array.isArray(body)).toEqual(true);
          expect(body.length).toEqual(1);
          expect(body[0]).toHaveProperty('name');
          expect(body[0]).not.toHaveProperty('_id');
        });
    });

    it('should select what is returned in documents', async () => {
      await PersonModel.create({name: 'a', motto: faker.lorem.sentence()});
      await PersonModel.create({name: 'b', motto: faker.lorem.sentence()});
      await PersonModel.create({name: 'c', motto: faker.lorem.sentence()});

      await request
        .post('/persons/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({select: 'name'})
        .then(({body}) => {
          expect(Array.isArray(body)).toEqual(true);
          expect(body.length).toEqual(3);
          expect(body[0].name).toEqual('a');
          expect(body[0].motto).toBeUndefined();
          expect(body[1].name).toEqual('b');
          expect(body[1].motto).toBeUndefined();
          expect(body[2].name).toEqual('c');
          expect(body[2].motto).toBeUndefined();
        });
      await request
        .post('/persons/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({select: 'motto'})
        .then(({body}) => {
          expect(body[0].name).toBeUndefined();
          expect(body[0].motto).toBeTruthy();
          expect(body[1].name).toBeUndefined();
          expect(body[1].motto).toBeTruthy();
          expect(body[2].name).toBeUndefined();
          expect(body[2].motto).toBeTruthy();
        });
    });
    it('should parse comma separated parameters defined in select', async () => {
      await PersonModel.create({
        name: 'a',
        motto: faker.lorem.sentence(),
        address: {
          street: 'Keskuojankatu',
          city: 'Tampere',
        },
      });
      await PersonModel.create({
        name: 'b',
        motto: faker.lorem.sentence(),
        address: {
          street: 'Mannerheimintie',
          city: 'Helsinki',
        },
      });

      await request
        .post('/persons/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({select: 'name, motto, address.street'})
        .then(({body}) => {
          expect(Array.isArray(body)).toEqual(true);
          expect(body.length).toEqual(2);
          expect(body[0].name).toEqual('a');
          expect(body[0].motto).toBeTruthy();
          expect(body[0].address.street).toEqual('Keskuojankatu');
          expect(body[0].address.city).toBeUndefined();
          expect(body[1].name).toEqual('b');
          expect(body[1].motto).toBeTruthy();
          expect(body[1].address.street).toEqual('Mannerheimintie');
          expect(body[1].address.city).toBeUndefined();
        });
    });
  });

  describe('if enableTotalCountHeader', () => {
    const testSetup = new TestSetup();
    let request: SuperAgentTest;

    afterEach(async () => {
      await testSetup.reset();
    });

    it('should return header X-Total-Count with total count of documents', async () => {
      request = await testSetup.init(true);
      for (let i = 0; i < 10; i++) {
        await PersonModel.create({name: faker.name.findName()});
      }
      await request
        .post('/persons/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({skip: 0, limit: 5, hello: 'world'})
        .then(({body, header}) => {
          expect(Array.isArray(body)).toEqual(true);
          expect(body.length).toEqual(5);
          expect(header['x-total-count']).toEqual('10');
        });
    });

    it('should not return header X-Total-Count if enableTotalCountHeader is not true', async () => {
      request = await testSetup.init();
      for (let i = 0; i < 10; i++) {
        await PersonModel.create({name: faker.name.findName()});
      }
      await request
        .post('/persons/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({skip: 0, limit: 5, hello: 'world'})
        .then(({body, header}) => {
          expect(Array.isArray(body)).toEqual(true);
          expect(body.length).toEqual(5);
          expect(header['x-total-count']).toBeUndefined();
        });
    });

    it('should return amount of documents defined in page and pageSize', async () => {
      request = await testSetup.init(true);
      for (let i = 0; i < 10; i++) {
        await PersonModel.create({name: faker.name.findName()});
      }
      await request
        .post('/persons/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({p: 0, pageSize: 5})
        .then(({body, header}) => {
          expect(Array.isArray(body)).toEqual(true);
          expect(body.length).toEqual(5);
          expect(header['x-total-count']).toEqual('10');
        });
      await request
        .post('/persons/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({p: 1, pageSize: 5})
        .then(({body, header}) => {
          expect(Array.isArray(body)).toEqual(true);
          expect(body.length).toEqual(5);
          expect(header['x-total-count']).toEqual('10');
        });
      await request
        .get('/persons')
        .expect(200)
        .expect('Content-Type', /json/)
        .query({pageSize: 5})
        .then(({body, header}) => {
          expect(Array.isArray(body)).toEqual(true);
          expect(body.length).toEqual(5);
          expect(header['x-total-count']).toEqual('10');
        });
      await request
        .get('/persons')
        .expect(200)
        .expect('Content-Type', /json/)
        .query({p: 0})
        .then(({body, header}) => {
          expect(Array.isArray(body)).toEqual(true);
          expect(body.length).toEqual(10);
          expect(header['x-total-count']).toEqual('10');
        });
    });
  });
});
