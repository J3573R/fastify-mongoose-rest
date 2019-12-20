
/**
 * Creates remove handler
 * 
 * @param {Object} Model Mongoose model 
 */
function createRemoveHandler(Model) {
  return () => async (request, reply) => {
    if (!request.params.id) {
      throw new Error('Id is required parameter.');
    }

    const result = await Model.deleteOne({ _id: request.params.id });

    return reply.send(result);
  };
}

module.exports = createRemoveHandler;
