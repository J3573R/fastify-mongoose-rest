import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '../types';
import {createResponseSchema, parseInput} from '../helpers';

export default function Details(
  basePath: string,
  model: Model<any>,
  options?: FastifyMongooseRestOptions
): {
  method: HTTPMethods;
  url: string;
  schema: {
    summary: string;
    tags: string[];
    params: object;
    querystring: object;
    response: object;
  };
  handler: any;
} {
  let response = {};
  if (options?.validationSchema) {
    response = createResponseSchema(options.validationSchema, 'object');
  }

  return {
    method: 'GET',
    url: `${basePath}/:id`,
    schema: {
      summary: `Get details of a single ${model.modelName} resource`,
      tags: options?.tags || [],
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
    handler: async (
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
    ) => {
      const findQuery: {[name: string]: string} = {};

      findQuery[options?.findProperty || '_id'] = request.params.id;

      const {populate, projection, select} = request.query;

      const query = model.findOne(findQuery);

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
