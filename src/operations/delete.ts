import {FastifyReply, FastifyRequest} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '../types';

export function Delete<T>(
  basePath: string,
  model: Model<T>,
  options?: FastifyMongooseRestOptions
): {
  method: 'DELETE';
  url: string;
  schema: {
    summary: string;
    tags?: string[];
    params: object;
    response: object;
  };
  handler: (
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply
  ) => Promise<any>;
} {
  const response = {
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

  const {tags, findProperty} = options || {};
  return {
    method: 'DELETE',
    url: `${basePath}/:id`,
    schema: {
      summary: `Delete a ${model.modelName} resource`,
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
      response,
    },
    handler: async (request, reply) => {
      const result = await model.deleteOne({
        [findProperty || '_id']: request.params.id,
      } as any);
      if (result.deletedCount < 1) {
        return reply.status(404).send(new Error('Resource not found'));
      }
      return reply.send(result);
    },
  };
}
