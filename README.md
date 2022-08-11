# Fastify-mongoose-rest

Package that generates fastify route objects from mongoose model. Supports validation schemas (ajv) & fastify-swagger. Validation schema is used also defining responses for fastify-swagger.

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
    'mongodb://localhost/fastify-mongoose-rest'
  );
  const CatRoutes = FastifyMongooseRest('cats', testModel, validationSchema);

  const fastify = Fastify({});
  fastify.register(FastifySwagger, {exposeRoute: true});

  Object.values(CatRoutes).map(r => fastify.route(r));

  fastify.listen(3000);
}

run();
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

Generated url example: `POST https://localhost/cats/search`

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