import { FastifyReply, FastifyRequest, HTTPMethods } from 'fastify';
import { Model } from 'mongoose';
import { FastifyMongooseRestOptions } from '..';
import { createResponseSchema, parseInput } from '../helpers';

export default function Search(
  name: string,
  model: Model<any>,
  options?: FastifyMongooseRestOptions,
): {
  method: HTTPMethods;
  url: string;
  schema: {
    summary: string;
    tags: string[];
    body: object;
    response: object;
  };
  handler: any;
} {
  let body: any = {};
  let response = {};

  if (options?.validationSchema) {
    body = {
      type: 'object',
      properties: {
        ...options.validationSchema,
      },
    };
    delete body.properties._id;
    response = createResponseSchema(options.validationSchema, 'array');
  }

  return {
    method: 'POST',
    url: `/${name}/search`,
    schema: {
      summary: `Search ${name}s`,
      tags: options?.tags || [],
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
          sort: {
            type: 'string',
            description: 'Sort options of mongoose',
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
          sort?: string;
          page?: number;
          pageSize?: number;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const { query, populate, projection, sort, page, pageSize } =
        request.body;

      const operation = model.find(query || {});

      if (populate) {
        operation.populate(parseInput(populate));
      }

      if (projection) {
        operation.projection(parseInput(projection));
      }

      if (sort) {
        operation.sort(parseInput(sort));
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
