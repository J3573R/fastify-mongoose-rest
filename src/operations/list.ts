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
      summary: `List ${name}`,
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
          skip: {
            type: 'number',
            description: 'Mongoose skip property',
          },
          limit: {
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
          skip?: number;
          limit?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      const {query, populate, projection, sort, skip, limit} = request.query;

      let qs: object = {};
      if (query) {
        qs = JSON.parse(query);
      }

      const operation = model.find(qs);
      const operationCount = await model.find(qs).countDocuments();

      if (populate) {
        operation.populate(parseInput(populate));
      }

      if (projection) {
        operation.projection(parseInput(projection));
      }

      if (sort) {
        operation.sort(parseInput(sort));
      }

      if (skip) {
        operation.skip(skip);
      }

      if (limit) {
        operation.limit(limit);
      }

      const resource = await operation.exec();
      reply.header('X-Total-Count', operationCount);
      return reply.send(resource);
    },
  };
}
