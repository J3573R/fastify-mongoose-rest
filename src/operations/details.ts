import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '..';
import {createResponseSchema, parseInput} from '../helpers';

export default function Details(
  name: string,
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
    url: `/${name}/:id`,
    schema: {
      summary: `Get details of single ${name}`,
      tags: options?.tags || [],
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: `Unique identifier of ${name}`,
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
        };
      }>,
      reply: FastifyReply
    ) => {
      const {populate, projection} = request.query;

      const query = model.findById(request.params.id);

      if (populate) {
        query.populate(parseInput(populate));
      }

      if (projection) {
        query.projection(parseInput(projection));
      }

      const resource = await query.exec();
      return reply.send(resource);
    },
  };
}
