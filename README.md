# Fastify-mongoose-rest

Package that generates fastify route objects from mongoose model. Supports validation schemas (ajv) & fastify-swagger. Validation schema is used also defining responses for fastify-swagger.

## Usage

```
npm i -s fastify-mongoose-rest
```

**Basic example**

Install packages, copy the script and run it. You can view the result from:

`localhost:3000/documentation`

```ts
import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import FastifyMongooseRest from 'fastify-mongoose-rest';
import Mongoose from 'mongoose';

const catSchema = new Mongoose.Schema({
  name: String,
  age: Number,
  owner: String,
});

const Cat = Mongoose.model('cat', catSchema);

const catValidationSchema = {
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
  await Mongoose.connect('mongodb://localhost/fastify-mongoose-rest');
  const catRoutes = FastifyMongooseRest('cats', Cat, {
    // Tag support for @fastify/swagger package
    tags: ['Cat'],
    // Validation schema for fastify
    validationSchema: catValidationSchema,
  });

  const server = Fastify({});
  await server.register(fastifySwagger, {exposeRoute: true});

  server.route(catRoutes.create);
  server.route(catRoutes.delete);
  server.route(catRoutes.details);
  server.route(catRoutes.list);
  server.route(catRoutes.modify);
  server.route(catRoutes.search);

  // Shorthand for registering all routes
  // Object.values(catRoutes).forEach((r) => server.route(r));

  await server.listen({host: '0.0.0.0', port: 3000});
}

run();
```

**Custom options**

Generated route can be used only partly if custom messages or handling is required.

```ts
server.route({
  method: 'GET',
  // Urls can be overriden. `details`, `modify` and `delete` handlers
  // expects `:id` to be present in url.
  url: '/cats/my-search-route/:id',
  // Schema definitions can be picked and combined with custom schema
  schema: {
    summary: 'My custom summary message',
    querystring: catRoutes.details.schema.querystring,
    response: {
      200: {
        type: 'string',
      },
    },
  },
  // This aproach allows use of hooks
  preHandler: myAwesomeAuthenticatorFunction,
  handler: catRoutes.details.handler,
});
```

## Routes

Package generates 5 different route specifications:

### Create

`POST` endpoint for creating documents.

Generated url example: `POST https://localhost/cats`

### Delete

`DELETE` endpoint for removing documents.

Generated url example: `DELETE https://localhost/cats/:id`

### Details

`GET` endpoint for getting single document from database.
Takes parameters in `querystring` and supports `select`, `populate` and `projection` mongoose functionalities.

Generated url example: `GET https://localhost/cats/:id`

### List

`GET` endpoint for getting multiple documents.
Takes parameters in `querystring` and supports `query`|`q`, `populate`, `projection`, `sort`, `skip`, `limit`, `p`, `pageSize` and `totalCount` properties.

`x-total-count` header can be enabled by sending `totalCount: true` parameter as part of the request payload. This indicates total count of documents in database with given filters. Can be used to

Generated url example: `GET https://localhost/cats`

### Modify

`PATCH` endpoint for modifying single document.

Generated url example: `PATCH https://localhost/cats/:id`

### Search

`POST` endpoint for getting multiple documents. Similar to `List` endpoint but takes inputs from `body`.

`x-total-count` header can be enabled by sending `totalCount: true` parameter as part of the request payload. This indicates total count of documents in database with given filters. Can be used to

Generated url example: `POST https://localhost/cats/search`.

### Insert Many

`POST` endpoint for inserting and array of documents. Creates a new document for each object in array.

Generated url example: `POST https://localhost/cats/insert-many`

## Querying

### Query

Query is expected to be stringified `object`. Object is parsed and passed to mongoose models query function without further filtering.

### Populate

Populate takes `string` or stringified `object` as input. Input is passed to mongoose populate functionality.

More information about populate: https://mongoosejs.com/docs/populate.html

### Projection

Projection takes `string` or stringified `object` as input. Input is passed to mongoose projection functionality.

More information about projection: https://mongoosejs.com/docs/api.html#query_Query-projection

### Select

Select takes `string` or stringified `object` as input. Input is passed to mongoose select functionality.

More information about select: https://mongoosejs.com/docs/api.html#query_Query-select

### Skip

Skip takes `number` as input.

More information: https://mongoosejs.com/docs/api/query.html#query_Query-limit

### Limit

Limit takes `number` as input.

More information: https://mongoosejs.com/docs/api/query.html#query_Query-skip

### P

P (page) takes `number` as input and is used to calculate value for skip.

### PageSize

PageSize takes `number` as input and is used as limit and to calculate value for skip.

### totalCount

`totalCount` parameter takes `boolean` as input and is used to enable `x-total-count` header. The header will show how much how much documents would be available in database with given query.
