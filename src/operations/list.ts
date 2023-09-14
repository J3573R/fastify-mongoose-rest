import {FastifyReply, FastifyRequest} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions, FindQueryOptions} from '../types';
import {createResponseSchema, findOperation} from '../utils';

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
      const {resources, totalCount} = await findOperation(model, request.query);

      if (totalCount) {
        reply.header('X-Total-Count', totalCount);
      }

      return reply.send(resources);
    },
  };
}
