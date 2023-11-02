import {FastifyReply, FastifyRequest} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '../types';
import {createResponseSchema, parseInput} from '../utils';

export function Details<T>(
  basePath: string,
  model: Model<T>,
  options: FastifyMongooseRestOptions
): {
  method: 'GET';
  url: string;
  schema: {
    summary: string;
    tags?: string[];
    params: object;
    querystring: object;
    response: object;
  };
  handler: (
    request: FastifyRequest<{
      Params: {
        id: string;
      };
      Querystring: {
        populate?: string;
        projection?: string;
        select?: string;
      };
    }>,
    reply: FastifyReply
  ) => Promise<any>;
} {
  const {tags, findProperty, validationSchema} = options;

  let response = {};
  if (validationSchema) {
    response = createResponseSchema(validationSchema, 'object');
  }

  return {
    method: 'GET',
    url: `${basePath}/:id`,
    schema: {
      summary: `Get details of a single ${model.modelName} resource`,
      tags,
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: `Unique identifier of ${model.modelName}`,
          },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          populate: {
            type: 'string',
            description: 'Population options of mongoose',
          },
          projection: {
            type: 'string',
            description: 'Projection options of mongoose',
          },
          select: {
            type: 'string',
            description: 'Select options of mongoose',
          },
        },
      },
      response,
    },
    handler: async (request, reply) => {
      const {populate, projection, select} = request.query;

      const query = model.findOne({
        [findProperty || '_id']: request.params.id,
      } as any);

      if (populate) {
        query.populate(parseInput(populate));
      }

      if (projection) {
        query.projection(parseInput(projection));
      }

      if (select) {
        query.select(parseInput(select));
      }

      const resource = await query.exec();

      if (!resource) {
        return reply.status(404).send(new Error('Resource not found'));
      }

      return reply.send(resource);
    },
  };
}
