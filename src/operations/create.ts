import {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  HTTPMethods,
} from 'fastify';
import { Model } from 'mongoose';

export default function Create(
  name: string,
  model: Model<any>,
  schema?: object,
): {
  method: HTTPMethods;
  url: string;
  schema: FastifySchema;
  handler: any;
} {
  let response: any = {};
  let body: any = { type: 'object' };

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
    method: 'POST',
    url: `/${name}`,
    schema: {
      body,
      response,
    },
    handler: async (
      request: FastifyRequest<{
        Body: unknown;
      }>,
      reply: FastifyReply,
    ) => {
      const resource = await model.create(request.body);
      return reply.send(resource);
    },
  };
}
