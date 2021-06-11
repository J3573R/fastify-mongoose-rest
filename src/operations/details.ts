import {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  HTTPMethods,
} from 'fastify';
import { Model } from 'mongoose';
import { parseInput } from '../helpers';

export default function Details(
  name: string,
  model: Model<any>,
  schema?: object,
): {
  method: HTTPMethods;
  url: string;
  schema: FastifySchema;
  handler: any;
} {
  let response = {};
  if (schema) {
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
    method: 'GET',
    url: `/${name}/:id`,
    schema: {
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: `Unique identifier of ${name}`,
          },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          populate: {
            type: 'string',
            description: 'Population options of mongoose',
          },
          projection: {
            type: 'string',
            description: 'Projection options of mongoose',
          },
        },
      },
      response,
    },
    handler: async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
        Querystring: {
          populate?: string;
          projection?: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const { populate, projection } = request.query;

      const query = model.findById(request.params.id);

      if (populate) {
        query.populate(parseInput(populate));
      }

      if (projection) {
        query.projection(parseInput(projection));
      }

      const resource = await query.exec();
      return reply.send(resource);
    },
  };
}
