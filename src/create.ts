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
): {
  method: HTTPMethods;
  url: string;
  schema: FastifySchema;
  handler: any;
} {
  return {
    method: 'POST',
    url: `/${name}`,
    schema: {
      body: {
        type: 'object',
      },
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
