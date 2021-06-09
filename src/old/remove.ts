import { FastifyReply, FastifyRequest } from 'fastify';
import { Model } from 'mongoose';

/**
 * Creates remove handler
 *
 * @param {Object} Model Mongoose model
 */
function createRemoveHandler<T>(model: Model<T>) {
  return () =>
    async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply: FastifyReply,
    ) => {
      if (!request.params.id) {
        throw new Error('Id is required parameter.');
      }

      const result = await model.findByIdAndRemove({ _id: request.params.id });

      return reply.send(result);
    };
}

module.exports = createRemoveHandler;
