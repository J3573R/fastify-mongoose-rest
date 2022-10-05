import fastify from 'fastify';
import {MongoMemoryServer} from 'mongodb-memory-server';
import Mongoose from 'mongoose';
import supertest from 'supertest';
import FastifyMongooseRest from '../../src/index';
import {
  CatModel,
  CatValidationSchema,
  PersonModel,
  PersonValidationSchema,
} from './models';

export default class TestSetup {
  public mongod!: MongoMemoryServer;

  async init() {
    const app = fastify();

    this.mongod = await MongoMemoryServer.create();
    const mongodUri = await this.mongod.getUri();

    await Mongoose.connect(mongodUri);

    const personRoutes = FastifyMongooseRest('persons', PersonModel, {
      validationSchema: PersonValidationSchema,
    });

    const catRoutes = FastifyMongooseRest('cats', CatModel, {
      validationSchema: CatValidationSchema,
    });

    app.route(personRoutes.create);
    app.route(personRoutes.delete);
    app.route(personRoutes.details);
    app.route(personRoutes.list);
    app.route(personRoutes.modify);
    app.route(personRoutes.search);
    app.route(personRoutes.insert);

    app.route(catRoutes.create);
    app.route(catRoutes.delete);
    app.route(catRoutes.details);
    app.route(catRoutes.list);
    app.route(catRoutes.modify);
    app.route(catRoutes.search);
    app.route(catRoutes.insert);

    app.route({
      method: 'DELETE',
      url: '/del',
      schema: {},
      handler: () => {},
    });

    const request = await supertest.agent(app.server);

    await app.ready();

    return request;
  }

  async reset() {
    await Mongoose.disconnect();
    await this.mongod.stop();
  }
}
