import {FastifyReply, FastifyRequest} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions, FindOptions} from '../types';
import {
  calculateSkipAndLimit,
  createResponseSchema,
  parseInput,
} from '../utils';

export function Search<T>(
  basePath: string,
  model: Model<T>,
  options?: FastifyMongooseRestOptions
): {
  method: 'POST';
  url: string;
  schema: {
    summary: string;
    tags?: string[];
    body: object;
    response: object;
  };
  handler: (
    request: FastifyRequest<{
      Body: FindOptions;
    }>,
    reply: FastifyReply
  ) => Promise<any>;
} {
  const {tags, validationSchema} = options || {};

  let body: any = {type: 'array'};
  let response = {};

  if (validationSchema) {
    body = {
      type: 'object',
      properties: {
        ...validationSchema,
      },
    };
    delete body.properties._id;
    response = createResponseSchema(validationSchema, 'array');
  }

  return {
    method: 'POST',
    url: `${basePath}/search`,
    schema: {
      summary: `Search through ${model.modelName} resources`,
      tags,
      body: {
        type: 'object',
        properties: {
          query: {
            type: ['object', 'string'],
            description: 'Mongoose find query',
          },
          q: {
            type: ['object', 'string'],
            description: 'Mongoose find query',
          },
          populate: {
            type: ['object', 'string'],
            description: 'Population options of mongoose',
          },
          projection: {
            type: ['object', 'string'],
            description: 'Projection options of mongoose',
          },
          sort: {
            type: ['object', 'string'],
            description: 'Sort options of mongoose',
          },
          select: {
            type: ['object', 'string'],
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
            description: 'Page number property',
          },
          page: {
            type: 'integer',
            description: 'Page number property',
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
      } = request.body;

      const operation = model.find(query || q || {});

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
        const operationCount = await model
          .find(query || q || {})
          .countDocuments();
        reply.header('X-Total-Count', operationCount);
      }

      return reply.send(resource);
    },
  };
}
