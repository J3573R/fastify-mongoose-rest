import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '../types';

export default function Delete(
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
    response: object;
  };
  handler: any;
} {
  let response: Record<number, any> = {};
  response = {
    200: {
      description: 'Success',
      type: 'object',
      properties: {
        acknowledged: {type: 'boolean'},
        deletedCount: {type: 'number'},
      },
    },
    404: {
      description: 'Not found',
      type: 'object',
      properties: {
        error: {type: 'string'},
        message: {type: 'string'},
      },
    },
    500: {
      description: 'Server error',
      type: 'object',
      properties: {
        error: {type: 'string'},
        message: {type: 'string'},
      },
    },
  };

  return {
    method: 'DELETE',
    url: `/${name}/:id`,
    schema: {
      summary: `Delete ${name}`,
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
      response,
    },
    handler: async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      const findQuery: {[name: string]: string} = {};
      findQuery[options?.findProperty || '_id'] = request.params.id;

      const res = await model.findOne(findQuery);
      if (!res) {
        return reply.status(404).send(new Error('Resource not found'));
      }
      const resource = await model.deleteOne(findQuery);
      return reply.send(resource);
    },
  };
}
