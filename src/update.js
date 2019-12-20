
/**
 * Creates update handler
 * 
 * @param {Object} Model Mongoose object 
 * @param {Object} options
 * @param {Boolean} options.runValidators
 * @param {Boolean} options.new
 * @param {Boolean} options.upsert 
 */
function createUpdateHandler(Model, options = {}) {
  return () => async (request, reply) => {
    if (!request.params.id) {
      throw new Error('Id is required parameter.');
    }

    const result = await Model.findOneAndUpdate({ _id: request.params.id },
      {
        $set: request.body,
      },
      {
        runValidators: options.runValidators || true,
        new: options.new || true,
        upsert: options.upsert || false,
      });

    return reply.send(result);
  };
}

module.exports = createUpdateHandler;
