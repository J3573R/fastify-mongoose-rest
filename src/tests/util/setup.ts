import fastify from 'fastify';
import {MongoMemoryServer} from 'mongodb-memory-server';
import Mongoose from 'mongoose';
import supertest from 'supertest';
import FastifyMongooseRest from '../../index';
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

    await Mongoose.connect(mongodUri, {
      useUnifiedTopology: true,
      useFindAndModify: true,
      useNewUrlParser: true,
    });

    const personRoutes = FastifyMongooseRest('persons', PersonModel, {
      validationSchema: PersonValidationSchema,
    });

    const catRoutes = FastifyMongooseRest('cats', CatModel, {
      validationSchema: CatValidationSchema,
    });

    Object.values(personRoutes).map(r => app.route(r));
    Object.values(catRoutes).map(r => app.route(r));

    const request = await supertest.agent(app.server);

    await app.ready();

    return request;
  }

  async reset() {
    await Mongoose.disconnect();
    await this.mongod.stop();
  }
}
