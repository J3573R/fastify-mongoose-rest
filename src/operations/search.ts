import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '..';
import {
  calculateSkipAndLimit,
  createResponseSchema,
  parseInput,
} from '../helpers';

export default function Search(
  name: string,
  model: Model<any>,
  options?: FastifyMongooseRestOptions
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
      summary: `Search ${name}`,
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
          select: {
            type: 'string',
            description: 'Select options of mongoose',
          },
          skip: {
            type: 'number',
            description: 'Mongoose skip property',
          },
          limit: {
            type: 'number',
            description: 'Mongoose limit property',
          },
          p: {
            type: 'number',
            description: 'Pagenumber property',
          },
          pageSize: {
            type: 'number',
            description: 'PageSize property',
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
          select?: string;
          skip?: number;
          limit?: number;
          p?: number;
          pageSize?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      const {
        query,
        populate,
        projection,
        sort,
        select,
        skip,
        limit,
        p,
        pageSize,
      } = request.body;

      const operation = model.find(query || {});
      const operationCount = await model.find(query || {}).countDocuments();

      if (populate) {
        operation.populate(parseInput(populate));
      }

      if (projection) {
        operation.projection(parseInput(projection));
      }

      if (sort) {
        operation.sort(parseInput(sort));
      }

      if (select) {
        operation.select(parseInput(select));
      }

      if (skip) {
        operation.skip(skip);
      }

      if (limit) {
        operation.limit(limit);
      }

      if (p || pageSize) {
        const {skip, limit} = calculateSkipAndLimit(p, pageSize);
        operation.skip(skip);
        operation.limit(limit);
      }

      const resource = await operation.exec();

      reply.header('X-Total-Count', operationCount);

      return reply.send(resource);
    },
  };
}
