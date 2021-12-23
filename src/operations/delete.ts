import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';

export default function Delete(
  name: string,
  model: Model<any>
): {
  method: HTTPMethods;
  url: string;

  handler: any;
} {
  return {
    method: 'DELETE',
    url: `/${name}/:id`,

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
        return reply.status(404).send('Resource not found');
      }
      const resource = await model.deleteOne({_id: request.params.id});
      return reply.send(resource);
    },
  };
}
