import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '..';
import {createResponseSchema} from '../helpers';

export default function InsertMany(
  name: string,
  model: Model<any>,
  options?: FastifyMongooseRestOptions
): {
  method: HTTPMethods;
  url: string;
  schema: {
    summary: string;
    tags: string[];
    body: object[];
    response: object;
  };
  handler: any;
} {
  let response: Record<number, any> = {};
  let body: any;

  if (options?.validationSchema) {
    body = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ...options.validationSchema,
        },
      },
    };

    response = createResponseSchema(options.validationSchema, 'array');
  }

  return {
    method: 'POST',
    url: `/${name}/insert-many`,
    schema: {
      summary: `Create new ${name}s`,
      tags: options?.tags || [],
      body,
      response,
    },
    handler: async (
      request: FastifyRequest<{
        Body: object[];
      }>,
      reply: FastifyReply
    ) => {
      const resource = await model.insertMany(request.body);
      return reply.send(resource);
    },
  };
}
