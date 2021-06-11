import { FastifyReply, FastifyRequest, HTTPMethods } from 'fastify';
import { Model } from 'mongoose';
import { FastifyMongooseRestOptions } from '..';
import { createResponseSchema } from '../helpers';

export default function Modify(
  name: string,
  model: Model<any>,
  options?: FastifyMongooseRestOptions,
): {
  method: HTTPMethods;
  url: string;
  schema: {
    summary: string;
    tags: string[];
    params: object;
    body: object;
    response: object;
  };
  handler: any;
} {
  let body: any = { type: 'object' };
  let response = {};

  if (options?.validationSchema) {
    body = {
      type: 'object',
      properties: {
        ...options.validationSchema,
      },
    };
    delete body.properties._id;
    response = createResponseSchema(options.validationSchema, 'object');
  }

  return {
    method: 'PATCH',
    url: `/${name}/:id`,
    schema: {
      summary: `Modify existing ${name}`,
      tags: options?.tags || [],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
      body,
      response,
    },
    handler: async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: object;
      }>,
      reply: FastifyReply,
    ) => {
      const resource = await model.findOneAndUpdate(
        { _id: request.params.id },
        { $set: request.body },
        { new: true },
      );
      return reply.send(resource);
    },
  };
}
