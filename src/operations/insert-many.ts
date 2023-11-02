import {FastifyReply, FastifyRequest} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '../types';
import {createResponseSchema} from '../utils';

export function InsertMany<T>(
  basePath: string,
  model: Model<T>,
  options: FastifyMongooseRestOptions
): {
  method: 'POST';
  url: string;
  schema: {
    summary: string;
    tags?: string[];
    body: object[];
    response: object;
  };
  handler: (
    request: FastifyRequest<{
      Body: object[];
    }>,
    reply: FastifyReply
  ) => Promise<any>;
} {
  const {tags, validationSchema} = options;

  let response: Record<number, unknown> = {};
  let body: any = {type: 'array'};

  if (validationSchema) {
    body = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ...validationSchema,
        },
      },
    };

    response = createResponseSchema(validationSchema, 'array');
  }

  return {
    method: 'POST',
    url: `${basePath}/insert-many`,
    schema: {
      summary: `Create multiple new ${model.modelName} resources`,
      tags,
      body,
      response,
    },
    handler: async (request, reply) => {
      const resources = await model.insertMany(request.body);
      return reply.send(resources);
    },
  };
}
