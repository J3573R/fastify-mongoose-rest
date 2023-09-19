<div align="center">

# Fastify Mongoose Rest

</div>

<div align="center">

[![npm](https://img.shields.io/npm/v/fastify-mongoose-rest?style=flat-square)](https://www.npmjs.com/package/fastify-mongoose-rest)
[![npm](https://img.shields.io/npm/dm/fastify-mongoose-rest?style=flat-square)](https://www.npmjs.com/package/fastify-mongoose-rest)
[![GitHub](https://img.shields.io/github/license/J3573R/fastify-mongoose-rest?style=flat-square)](https://github.com/J3573R/fastify-mongoose-rest/blob/master/LICENSE.md)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=fastify-mongoose-rest&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=fastify-mongoose-rest)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/fastify-mongoose-rest?style=flat-square)](https://bundlephobia.com/package/fastify-mongoose-rest@latest)
[![npm type definitions](https://img.shields.io/npm/types/fastify-mongoose-rest?style=flat-square)](https://www.npmjs.com/package/fastify-mongoose-rest)

</div>

## Table of Contents

- [Features](#features)
- [Installing](#installing)
- [Example](#example)
- [Initialization](#initialization)
- [Adding routes](#adding-routes)
- [FastifyMongooseRestOptions](#fastifymongooserestoptions)
- [Operations](#operations)
  - [Create](#create)
  - [Delete](#delete)
  - [Details](#details)
  - [Modify](#modify)
  - [List](#list)
  - [Search](#search)
  - [Insert many](#insert-many)
- [Search parameters](#search-parameters)
  - [query](#query)
  - [q](#q)
  - [populate](#populate)
  - [projection](#projection)
  - [select](#select)
  - [sort](#sort)
  - [skip](#skip)
  - [limit](#limit)
  - [page](#page)
  - [p](#p)
  - [pageSize](#pagesize)
- [Total count parameter](#total-count-parameter)
- [TypeScript](#typescript)
- [Credits](#credits)
- [License](#license)

## Features

- Creates a set of RESTful [Fastify routes](https://fastify.dev/docs/latest/Reference/Routes) of a [Mongoose model](https://mongoosejs.com/docs/api/model.html) for common CRUD operations.
  - Listing / Searching documents
  - Details of a document
  - Inserting a document
  - Modifying a document
  - Deleting a document
  - Inserting multiple documents at once
- Automatically adds tags, summary, and description for [Open API](https://swagger.io/) documentation using [Fastify Swagger](https://github.com/fastify/fastify-swagger).
- Validates the request body using [Fastify Schema](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization) supplied in the form of a [JSON Schema](https://json-schema.org/).
- Pagination support with [page](#page) and [pageSize](#pagesize) parameters.

## Installing

Using npm:

```bash
$ npm install fastify-mongoose-rest
```

Using yarn:

```bash
$ yarn add fastify-mongoose-rest
```

Once the package is installed, you can import the library in using `import` or `require`:

```js
import FastifyMongooseRest from 'fastify-mongoose-rest';
```

Or using `require`:

```js
const FastifyMongooseRest = require('fastify-mongoose-rest');
```

## Example

Basic usage:

```js
/* src/models/cat.js */
import mongoose from 'mongoose';

const catSchema = mongoose.Schema({
  name: String,
  age: Number,
  color: String,
});

export default mongoose.model('Cat', catSchema);

/* src/routes/cats.js */
import Cat from '../models/cat';
import FastifyMongooseRest from 'fastify-mongoose-rest';

const catFastify = FastifyMongooseRest('cats', Cat);

export default function (fastify) {
  // GET /cats
  fastify.route(catFastify.list);
  // POST /cats/search
  fastify.route(catFastify.search);
  // GET /cats/:id
  fastify.route(catFastify.details);
  // POST /cats
  fastify.route(catFastify.create);
  // PATCH /cats/:id
  fastify.route(catFastify.modify);
  // DELETE /cats/:id
  fastify.route(catFastify.delete);
  // POST /cats/insert-many
  fastify.route(catFastify.insertMany);
}
```

Basic usage with options:

```js
/* src/models/cat.js */
import mongoose from 'mongoose';

const catSchema = mongoose.Schema({
  registratin: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  age: Number,
  color: String,
});

export default mongoose.model('Cat', catSchema);

/* src/routes/cats.js */
import Cat from '../models/cat';
import FastifyMongooseRest from 'fastify-mongoose-rest';

const catValidationSchema = {
  registration: {type: 'string'},
  name: {type: 'string'},
  age: {type: 'number'},
  color: {type: 'string'},
};

const catFastify = FastifyMongooseRest('cats', Cat, {
  validationSchema: catValidationSchema,
  tags: ['cats'],
  findProperty: 'registration',
});

export default function (fastify) {
  fastify.route(catFastify.list);
}
```

Each of the route objects return a partial Fastify route object, so you can add any other Fastify route options or override existing ones by merging the objects:

```js
/* src/routes/cats.js */
import Cat from '../models/cat';
import FastifyMongooseRest from 'fastify-mongoose-rest';

const catValidationSchema = {
  name: {type: 'string'},
  age: {type: 'number'},
  color: {type: 'string'},
};

const catFastify = FastifyMongooseRest('cats', Cat, {
  validationSchema: catValidationSchema,
});

export default function (fastify) {
  fastify.route({
    ...catFastify.list,
    schema: {
      ...catFastify.list.schema,
      summary: 'List all cats',
      description: 'List all cats',
    },
  });
}
```

## Initialization

Basic initialization:

```js
import Cat from '../models/cat';
import FastifyMongooseRest from 'fastify-mongoose-rest';

const catFastify = FastifyMongooseRest('cats', Cat);
```

## Adding routes

```js
// No changes
fastify.route(catFastify.list);

// With changes
fastify.route({
  ...catFastify.list,
  schema: {
    ...catFastify.list.schema,
    summary: 'List all cats',
    description: 'List all cats',
  },
});
```

## FastifyMongooseRestOptions

These are the available configuration options for the `FastifyMongooseRest` function:

```js
{
  // `validationSchema` is the schema properties that will be used for validation in create and modify routes
  // It will also be used to validate returned documents in details, list, and search routes
  // In the same way this will also change how the output of OpenAPI documentation will look like
  // This is an optional property
  validationSchema: {
    name: { type: 'string' },
    age: { type: 'number' },
    color: { type: 'string' },
  },

  // `tags` is the tags that will be used for Open API documentation
  // This is an optional property
  tags: ['cats'],

  // By setting this property, instead of querying by `_id`, the query will be done by the property specified here
  // This will affect details, delete, and modify operations which use :id as a route parameter
  // This is an optional property
  findProperty: 'userId',
}
```

## Operations

### Create

The create operation will insert a new document into the database. Uses the [validation schema](#fastifymongooserestoptions) to validate the request body.

### Delete

The delete operator will delete a document from the database based on the `:id` route parameter of the request.

The field used for the query can be changed by setting the `findProperty` option in the [options](#fastifymongooserestoptions) object. The default value is `_id`.

### Details

The details operation will return a single document from the database based on the `:id` route parameter of the request.

The field used for the query can be changed by setting the `findProperty` option in the [options](#fastifymongooserestoptions) object. The default value is `_id`.

### Modify

The modify operation will modify a document from the database based on the `:id` route parameter of the request. Uses the [validation schema](#fastifymongooserestoptions) to validate the request body.

The field used for the query can be changed by setting the `findProperty` option in the [options](#fastifymongooserestoptions) object. The default value is `_id`.

### List

The list operation will return a list of documents from the database based on the [search parameters](#search-parameters) from the query string of the request.

Same as the [search operation](#search) but with query parameters instead of a request body.

Given the [total count parameter](#total-count-parameter) is set to `true`, the response will also include the total count of documents that match the search parameters in the `X-Total-Count` header.

### Search

The search operation will return a list of documents from the database based on the [search parameters](#search-parameters) from the body of the request.

Same as the [list operation](#list) but with a request body instead of query parameters.

Given the [total count parameter](#total-count-parameter) is set to `true`, the response will also include the total count of documents that match the search parameters in the `X-Total-Count` header.

### Insert many

The insert many operation will insert multiple documents into the database. Uses the [validation schema](#fastifymongooserestoptions) to validate the request body.

## Search parameters

The search parameters are supplied in the request body for [search operation](#search) or as query parameters in the request URL depending for [list operation](#list).

### query

<!-- Will be used as the filter param in the [Mongoose find](<https://mongoosejs.com/docs/api/model.html#Model.find()>) operation. Defaults to `{}`. -->

<!-- Supplied as an object. Can be either a JSON object or a stringified JSON object. -->

The `query` takes a object as an value that can be either a JSON object from the body, or a stringified JSON object from query string or body.

Default value is `{}`.

Example:

```JSON
{"query":{"name": "Kitty","age":2}}
```

or

```JSON
{"query":"{\"name\":\"Kitty\",\"age\":2}"}
```

More information: https://mongoosejs.com/docs/api/model.html#Model.find()

### q

`q` is an alias for [query](#query).

```JSON
{"q":{"name":"Kitty","age":2,}}
```

### populate

`populate` takes a string, an object, or and array as a value. The object or array can be either in JSON format in the body, or in a stringified JSON format in query string or body.

By default no population is done.

Examples:

```JSON
{"populate":"owner"}
```

```JSON
{"populate":{"path":"owner"}}
```

```JSON
{"populate":"{\"path\":\"owner\"}"}
```

```JSON
{"populate":[{"path":"owner"},{"path":"children"}]}
```

```JSON
{"populate":"[{\"path\":\"owner\"},{\"path\":\"children\"}]"}
```

More information: https://mongoosejs.com/docs/populate.html

### projection

`projection` takes a string or an object as a value. The object can be either a JSON object from the body, or a stringified JSON object from query string or body.

The string can be formatted either as a comma separated list or a space separated list.

By default no projection is done.

Examples:

```JSON
{"projection":"name"}
```

```JSON
{"projection":"name,age"}
```

```JSON
{"projection":"name age"}
```

```JSON
{"projection":{"name":1}}
```

```JSON
{"projection":"{\"name\":1}"}
```

More information: https://mongoosejs.com/docs/api/query.html#Query.prototype.projection()

### select

`select` takes a string or an object as a value. The object can be either a JSON object from the body, or a stringified JSON object from query string or body.

The string can be formatted either as a comma separated list or a space separated list.

By default no selection is done.

Examples:

```JSON
{"select":"name"}
```

```JSON
{"select":"name,age"}
```

```JSON
{"select":"name age"}
```

```JSON
{"select":{"name":1}}
```

```JSON
{"select":"{\"name\":1}"}
```

More information: https://mongoosejs.com/docs/api/query.html#Query.prototype.select()

### sort

`sort` takes a string or an object as a value. The object can be either a JSON object from the body, or a stringified JSON object from query string or body.

The string can be formatted either as a comma separated list or a space separated list.

By default no sorting is done.

Examples:

```JSON
{"sort":"name"}
```

```JSON
{"sort":"name,-age"}
```

```JSON
{"sort":"name -age"}
```

```JSON
{"sort":{"name":1}}
```

```JSON
{"sort":"{\"name\":1}"}
```

More information: https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()

### skip

`skip` takes a number as a value.

The `skip` parameter is ignored if [page](#page) or [pageSize](#pagesize) parameters are supplied.

By default no documents are skipped.

Examples:

```JSON
{"skip":10}
```

More information: https://mongoosejs.com/docs/api/query.html#Query.prototype.skip()

### limit

`limit` takes a number as a value.

The `limit` parameter is ignored if [page](#page) or [pageSize](#pagesize) parameters are supplied.

By default no documents are limited.

Examples:

```JSON
{"limit":10}
```

More information: https://mongoosejs.com/docs/api/query.html#Query.prototype.limit()

### page

`page` takes a positive number as a value.

The `page` parameter is used to calculate the `skip` parameter with the [pageSize](#pagesize) parameter. Note that this calculation will start from 0.

The formula is `skip = page * pageSize`. So if `page` was 1 and `pageSize` was 10, then skip would be 10 and it would skip the first 10 documents.

By default the page is 0 if [pageSize](#pagesize) is supplied or if the supplied value is less than 0.

Examples:

```JSON
{"page":1}
```

### p

`p` is an alias for [page](#page).

```JSON
{"p":1}
```

### pageSize

`pageSize` takes a positive number as a value.

The `pageSize` parameter is used to calculate the `skip` parameter with the [page](#page) parameter.

The formula is `skip = page * pageSize`. So if `page` was 1 and `pageSize` was 10, then skip would be 10 and it would skip the first 10 documents.

By default the pageSize is 100 if [page](#page) is supplied or if the supplied value is less than 1.

Examples:

```JSON
{"pageSize":100}
```

## Total count parameter

`totalCount` takes a boolean as a value. If set to `true`, the response will also include the total count of documents that match the search parameters in the `X-Total-Count` header.

This parameter is available for both [list](#list) and [search](#search) operations.

Include the parameter in the payload of the request body for [search operation](#search) or as a query parameter in the request URL for [list operation](#list).

## TypeScript

This library is written in TypeScript and comes with its own type definitions.

## Credits

This library is inspired by [restify-mongoose](https://www.npmjs.com/package/restify-mongoose) and is meant to be a replacement for it to be used with [Fastify](https://www.fastify.io/).

## License

[MIT](LICENSE)
