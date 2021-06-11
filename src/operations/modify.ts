import {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  HTTPMethods,
} from 'fastify';
import { Model } from 'mongoose';

export default function Modify(
  name: string,
  model: Model<any>,
  schema?: object,
): {
  method: HTTPMethods;
  url: string;
  schema: FastifySchema;
  handler: any;
} {
  let body: any = { type: 'object' };
  let response = {};

  if (schema) {
    body = {
      type: 'object',
      properties: {
        ...schema,
      },
    };
    delete body.properties._id;
    response = {
      200: {
        type: 'object',
        properties: {
          ...schema,
        },
      },
    };
  }

  return {
    method: 'PATCH',
    url: `/${name}/:id`,
    schema: {
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
      );
      return reply.send(resource);
    },
  };
}
