
/**
 * Creates insert handler.
 * 
 * @param {Object} Model Mongoose model 
 */
function createInsertHandler(Model) {
  return () => async (request, reply) => {
    const result = await Model.create(request.body);
    return reply.send(result);
  };
}

module.exports = createInsertHandler;
