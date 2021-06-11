import {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  HTTPMethods,
} from 'fastify';
import { Model } from 'mongoose';
import { parseInput } from '../helpers';

export default function Search(
  name: string,
  model: Model<any>,
  schema?: object,
): {
  method: HTTPMethods;
  url: string;
  schema: FastifySchema;
  handler: any;
} {
  let body: any = {};
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
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ...schema,
          },
        },
      },
    };
  }

  return {
    method: 'POST',
    url: `/${name}/search`,
    schema: {
      body: {
        type: 'object',
        properties: {
          query: {
            type: 'object',
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
        Body: {
          query?: object;
          populate?: string;
          projection?: string;
          page?: number;
          pageSize?: number;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const { query, populate, projection, page, pageSize } = request.body;

      const operation = model.find(query || {});

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
