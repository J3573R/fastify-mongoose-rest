import fastify from 'fastify';
import supertest from 'supertest';
import FastifyMongooseRest from '../../src/index';
import {
  CatModel,
  CatValidationSchema,
  PersonModel,
  PersonValidationSchema,
  UserModel,
  UserValidationSchema,
} from './models';

export default async () => {
  const app = fastify();

  app.setErrorHandler((error, _, reply) => {
    console.error(error);
    reply.send(error);
  });

  const personRoutes = FastifyMongooseRest('persons', PersonModel, {
    validationSchema: PersonValidationSchema,
  });

  const catRoutes = FastifyMongooseRest('cats', CatModel, {
    validationSchema: CatValidationSchema,
  });

  const userRoutes = FastifyMongooseRest('users', UserModel, {
    validationSchema: UserValidationSchema,
    findProperty: 'userId',
  });

  // This is just to test the default value of options and slash at the start generation
  const users2Routes = FastifyMongooseRest('/users2', UserModel);

  app.route(personRoutes.create);
  app.route(personRoutes.delete);
  app.route(personRoutes.details);
  app.route(personRoutes.list);
  app.route(personRoutes.modify);
  app.route(personRoutes.search);
  app.route(personRoutes.insertMany);

  app.route(catRoutes.create);
  app.route(catRoutes.delete);
  app.route(catRoutes.details);
  app.route(catRoutes.list);
  app.route(catRoutes.modify);
  app.route(catRoutes.search);
  app.route(catRoutes.insertMany);

  app.route(userRoutes.create);
  app.route(userRoutes.delete);
  app.route(userRoutes.details);
  app.route(userRoutes.list);
  app.route(userRoutes.modify);
  app.route(userRoutes.search);
  app.route(userRoutes.insertMany);

  app.route(users2Routes.create);

  await app.ready();

  return supertest(app.server);
};
