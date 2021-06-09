import { FastifyReply, FastifyRequest } from 'fastify';
import { Model, QueryOptions } from 'mongoose';

/**
 * Creates update handler
 *
 * @param {Object} Model Mongoose object
 * @param {Object} options
 * @param {Boolean} options.runValidators
 * @param {Boolean} options.new
 * @param {Boolean} options.upsert
 */
function createUpdateHandler(model: Model<any>, options: QueryOptions) {
  return () =>
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: any;
      }>,
      reply: FastifyReply,
    ) => {
      if (!request.params.id) {
        throw new Error('Id is required parameter.');
      }

      const result = await model.findOneAndUpdate(
        { _id: request.params.id },
        {
          $set: request.body,
        },
        {
          runValidators: options.runValidators || true,
          new: options.new || true,
          upsert: options.upsert || false,
        },
      );

      return reply.send(result);
    };
}

export default createUpdateHandler;
