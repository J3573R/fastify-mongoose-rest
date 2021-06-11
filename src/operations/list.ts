import {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  HTTPMethods,
} from 'fastify';
import { Model } from 'mongoose';
import { parseInput } from '../helpers';

export default function List(
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
        type: 'array',
        items: {
          type: 'object',
          properties: schema,
        },
      },
    };
  }

  return {
    method: 'GET',
    url: `/${name}`,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Mongoose find query',
          },
          populate: {
            type: 'string',
            description: 'Population options of mongoose',
          },
          projection: {
            type: 'string',
            description: 'Projection options of mongoose',
          },
          page: {
            type: 'number',
            description: 'Mongoose skip property',
          },
          pageSize: {
            type: 'number',
            description: 'Mongoose limit property',
          },
        },
      },
      response,
    },
    handler: async (
      request: FastifyRequest<{
        Querystring: {
          query?: string;
          populate?: string;
          projection?: string;
          page?: number;
          pageSize?: number;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const { query, populate, projection, page, pageSize } = request.query;

      let qs: object = {};
      if (query) {
        qs = JSON.parse(query);
      }

      const operation = model.find(qs);

      if (populate) {
        operation.populate(parseInput(populate));
      }

      if (projection) {
        operation.projection(parseInput(projection));
      }

      if (page) {
        operation.skip(page);
      }

      if (pageSize) {
        operation.limit(pageSize);
      }

      const resource = await operation.exec();
      return reply.send(resource);
    },
  };
}
