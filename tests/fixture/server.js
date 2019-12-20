const fastify = require('fastify');
const Mongoose = require('mongoose');
const Resource = require('./resource.model');
const User = require('./user.model');
const FastifyMongooseRest = require('../../');

module.exports = () => {
  Mongoose.connect('mongodb://localhost:27017/fastify-mongoose-rest', { useNewUrlParser: true, useUnifiedTopology: true });

  const ResourceAPI = FastifyMongooseRest(Resource);

  const server = fastify({});

  server.get('/resources', ResourceAPI.find());
  server.get('/resources/:id', ResourceAPI.findOne());
  server.post('/resources/search', ResourceAPI.search());
  server.post('/resources', ResourceAPI.create());
  server.patch('/resources/:id', ResourceAPI.update());
  server.delete('/resources/:id', ResourceAPI.remove());

  return server;
};
