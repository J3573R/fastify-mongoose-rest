# Fastify-mongoose-rest

Fastify mongoose rest generates simple route handlers & schemas for mongoose models.

## Usage

```
npm i -s fastify-mongoose-rest
```

Basic example:

```ts
import Fastify from 'fastify';
import FastifySwagger from 'fastify-swagger';
import FastifyMongooseRest from 'fastify-mongoose-rest';
import Mongoose from 'mongoose';

const schema = new Mongoose.Schema({
  name: String,
  age: Number,
  owner: String,
});

const Cat = Mongoose.model('cat', testSchema);

const validationSchema = {
  name: {
    type: 'string',
  },
  age: {
    type: 'number',
  },
  owner: {
    type: 'string',
  },
};

async function run() {
  const connection = await Mongoose.connect(
    'mongodb://localhost/fastify-mongoose-rest',
  );
  const CatRoutes = FastifyMongooseRest('cats', testModel, validationSchema);

  const fastify = Fastify({});
  fastify.register(FastifySwagger, { exposeRoute: true });

  Object.values(CatRoutes).map((r) => fastify.route(r));

  fastify.listen(3000);
}

run();
```
