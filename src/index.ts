import Mongoose, { Document, Schema } from 'mongoose';

import Fastify from 'fastify';
import { fastifySwagger } from 'fastify-swagger';
import Details from './operations/details';
import Create from './operations/create';
import Modify from './operations/modify';
import List from './operations/list';
import Search from './operations/search';

interface Test {
  name: string;
  age: number;
}

type TestDocument = Test & Document;

const schema = new Schema<Test>({
  name: String,
  age: Number,
});

const validationSchema = {
  _id: { type: 'string' },
  name: { type: 'string' },
  age: { type: 'string' },
};

Mongoose.connect('mongodb://localhost/test');

const model = Mongoose.model<TestDocument>('test', schema);

const fastify = Fastify({});
fastify.register(fastifySwagger, {
  exposeRoute: true,
});

const testDetails = Details('test-model', model, validationSchema);
const testCreate = Create('test-model', model, validationSchema);
const testModify = Modify('test-model', model, validationSchema);
const testList = List('test-model', model, validationSchema);
const testSearch = Search('test-model', model, validationSchema);

fastify.route(testDetails);
fastify.route(testCreate);
fastify.route(testModify);
fastify.route(testList);
fastify.route(testSearch);

fastify.listen(3000);
