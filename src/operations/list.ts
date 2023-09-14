import {FastifyReply, FastifyRequest} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions, FindQueryOptions} from '../types';
import {
  calculateSkipAndLimit,
  createResponseSchema,
  parseInput,
} from '../utils';

export function List<T>(
  basePath: string,
  model: Model<T>,
  options?: FastifyMongooseRestOptions
): {
  method: 'GET';
  url: string;
  schema: {
    summary: string;
    tags?: string[];
    querystring: object;
    response: object;
  };
  handler: (
    request: FastifyRequest<{
      Querystring: FindQueryOptions;
    }>,
    reply: FastifyReply
  ) => Promise<any>;
} {
  const {tags, validationSchema} = options || {};

  let response = {};
  if (validationSchema) {
    response = createResponseSchema(validationSchema, 'array');
  }

  return {
    method: 'GET',
    url: `${basePath}`,
    schema: {
      summary: `List ${model.modelName} resources`,
      tags,
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
            type: 'integer',
            description: 'Mongoose skip property',
          },
          limit: {
            type: 'integer',
            description: 'Mongoose limit property',
          },
          p: {
            type: 'integer',
            description: 'Pagenumber property',
          },
          pageSize: {
            type: 'integer',
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
    handler: async (request, reply) => {
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
