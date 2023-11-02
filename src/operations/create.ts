import {FastifyReply, FastifyRequest} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '../types';
import {createResponseSchema} from '../utils';

export function Create<T>(
  basePath: string,
  model: Model<T>,
  options: FastifyMongooseRestOptions
): {
  method: 'POST';
  url: string;
  schema: {
    summary: string;
    tags?: string[];
    body: object;
    response: object;
  };
  handler: (request: FastifyRequest, reply: FastifyReply) => Promise<any>;
} {
  const {tags, validationSchema} = options;

  let response: Record<number, unknown> = {};
  let body: any = {type: 'object'};

  if (validationSchema) {
    body = {
      type: 'object',
      properties: {
        ...validationSchema,
      },
    };

    delete body.properties._id;
    response = createResponseSchema(validationSchema, 'object');
  }

  return {
    method: 'POST',
    url: basePath,
    schema: {
      summary: `Create a new ${model.modelName} resource`,
      tags,
      body,
      response,
    },
    handler: async (request, reply) => {
      const resource = await model.create(request.body);
      return reply.send(resource);
    },
  };
}
