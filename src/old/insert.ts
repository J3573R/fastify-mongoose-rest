import Mongoose from 'mongoose';
import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Creates insert handler.
 *
 * @param {Object} Model Mongoose model
 */
function createInsertHandler<T>(model: Mongoose.Model<T>) {
  return () => async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await model.create(request.body);
    return reply.send(result);
  };
}

export default createInsertHandler;
