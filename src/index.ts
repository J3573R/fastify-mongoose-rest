import Mongoose, { Document, Schema } from 'mongoose';

import Fastify from 'fastify';
import { fastifySwagger } from 'fastify-swagger';
import Details from './details';
import Create from './create';

interface Test {
  name: string;
  age: number;
}

type TestDocument = Test & Document;

const schema = new Schema<Test>({
  name: String,
  age: Number,
});

Mongoose.connect('mongodb://localhost/test');

const model = Mongoose.model<TestDocument>('test', schema);

const fastify = Fastify({});
fastify.register(fastifySwagger, {
  exposeRoute: true,
});

const testDetails = Details('test-model', model);
const testCreate = Create('test-model', model);

fastify.route(testDetails);
fastify.route(testCreate);

fastify.listen(3000);
