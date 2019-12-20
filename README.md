# Fastify-mongoose-rest

Fastify mongoose rest generates simple route handlers & schemas for mongoose models. This package is inspired by [restify-mongoose](https://github.com/saintedlama/restify-mongoose) and supports partly same format to make migration easier.

## Usage

### Initialization

Install fastify-mongoose-rest package:

```
npm i -s fastify-mongoose-rest
```

Setup your fastify server and mongoose:

```js
const fastify = require('fastify');
const Mongoose = require('mongoose');
const FastifyMongooseRest = require('fastify-mongoose-rest');

Mongoose.connect('mongodb://localhost:27017/fastify-mongoose-rest', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Cat = Mongoose.model('Cat', {
  name: {
    type: String,
    required: true
  },
});


// Initialize fastify mongoose rest
const CatAPI = FastifyMongooseRest(Cat);

const server = fastify({});

// Setup routes
server.post('/cats', CatAPI.create());
server.get('/cats/:id', CatAPI.findOne());
server.patch('/cats/:id', CatAPI.update());
server.delete('/cats/:id', CatAPI.remove());
server.post('/cats/search', CatAPI.search());

async function startServer() {
  await server.listen(3000);
  console.log('Server started');
}

startServer();
```

## Query
Find & Search routes allows to insert query trough query string or body, depending on method used. These queries support everything you can insert into mongoose query.
Query works with keywords `query` and `q`.

Example:
```
http://localhost:3000/cats?query={"name": "John"}

OR

http://localhost:3000/cats?q={"name": "John"}
```

## Pagination
Find & Search routes allow to paginate results. Pagination is `OFF` by default.

To use pagination, add limit and/or skip to your request:
```
PAGE 1
http://localhost:3000/cats?limit=10&skip=0

PAGE 2
http://localhost:3000/cats?limit=10&skip=1

etc...
```

Pagination supports following terms:

Limit can also be `pageSize`.

Skip can be `page` or `p`.

## Sort

Find & Search supports sorting.

Sort property from query will be passed straight to mongoose sort method.

Example:
```
http://localhost:3000/cats?sort={"name": 1}
http://localhost:3000/cats?sort=-name
```

## Projection
Projection can be passed in Find & Search in two ways: in queries or in function arguments.

For queries, it works like this:

```
htpp://localhost:3000/cats?projection={"name": 0}
http://localhost:3000/cats?projection=-name
```

Projection in function arguments works as following:

```js
let catProjection = function(request, item, cb) {
  var cat = {
    name: item.name,
  };
  return cb(null, user);
};

server.get('/cats/name', CatAPI.find({ projection: catProjection }));
```

## Filter
Filter can be used to force parameters into queries. This can be very helpful when
url defines multiple scopes for data.

Example:
```js
let catFilter = function(request, item, cb) {
  return { breed: request.params.breed };
};

server.get('/cats/name', CatAPI.find({ filter: catFilter }));

// http://localhost:3000/breeds/:breed/cats/:id
```

## Populate
Results can be populated like any other mongoose result. Population accepts following
syntax:

```
http://localhost:3000/cats?populate=history
```

## Search function

Fastify mongoose rest has special function included: `Search`.
This function behaves same way as `find` except it get parameters from body
of the request. This is meant to be used when url parameters would make request
too long.

Example:
```js
var request = require("request");

var options = {
  method: 'POST',
  url: 'http://localhost:3000/cats/search',
  headers: {'content-type': 'application/json'},
  body: {
    populate: {path: 'cats'}, 
    skip: 0, 
    limit: 10, 
    projection: '-_id'
  },
  json: true
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```