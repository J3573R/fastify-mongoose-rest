import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '../types';
import {
  calculateSkipAndLimit,
  createResponseSchema,
  parseInput,
} from '../utils';

export default function List(
  basePath: string,
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
    url: `${basePath}`,
    schema: {
      summary: `List ${model.modelName} resources`,
      tags: options?.tags || [],
      querystring: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Mongoose find query',
          },
          q: {
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
          totalCount: {
            type: 'boolean',
            description: 'Should endpoint return X-Total-Count header',
          },
        },
      },
      response,
    },
    handler: async (
      request: FastifyRequest<{
        Querystring: {
          query?: string;
          q?: string;
          populate?: string;
          projection?: string;
          sort?: string;
          select?: string;
          skip?: number;
          limit?: number;
          p?: number;
          pageSize?: number;
          totalCount?: boolean;
        };
      }>,
      reply: FastifyReply
    ) => {
      const {
        query,
        q,
        populate,
        projection,
        sort,
        select,
        skip,
        limit,
        p,
        pageSize,
        totalCount,
      } = request.query;

      let qs: object = {};
      if (query) {
        qs = JSON.parse(query);
      } else if (q) {
        qs = JSON.parse(q);
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

      if (totalCount === true) {
        const operationCount = await model.find(qs).countDocuments();
        reply.header('X-Total-Count', operationCount);
      }

      return reply.send(resource);
    },
  };
}
