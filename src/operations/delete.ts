import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';
import {createResponseSchema} from '../helpers';

export default function Delete(
  name: string,
  model: Model<any>
): {
  method: HTTPMethods;
  url: string;
  schema: {
    response: object;
  };
  handler: any;
} {
  let response: Record<number, any> = {};

  response = createResponseSchema({}, 'object');
  response = {
    ...response,
    404: {
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
      const res = await model.findById(request.params.id);
      if (!res) {
        return reply.status(404).send(new Error('Resource not found'));
      }
      const resource = await model.deleteOne({_id: request.params.id});
      return reply.send(resource);
    },
  };
}
