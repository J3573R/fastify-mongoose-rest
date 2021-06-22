import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '..';
import {createResponseSchema, parseInput} from '../helpers';

export default function List(
  name: string,
  model: Model<any>,
  options?: FastifyMongooseRestOptions
): {
  method: HTTPMethods;
  url: string;
  schema: {
    summary: string;
    tags: string[];
    querystring: object;
    response: object;
  };
  handler: any;
} {
  let response = {};
  if (options?.validationSchema) {
    response = createResponseSchema(options.validationSchema, 'array');
  }

  return {
    method: 'GET',
    url: `/${name}`,
    schema: {
      summary: `List ${name}s`,
      tags: options?.tags || [],
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
        Querystring: {
          query?: string;
          populate?: string;
          projection?: string;
          sort?: string;
          page?: number;
          pageSize?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      const {query, populate, projection, sort, page, pageSize} = request.query;

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
