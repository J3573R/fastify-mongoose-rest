const {
  createInsertHandler,
  createRemoveHandler,
  createUpdateHandler,
  createSearchHandler,
} = require('./src');

/**
 * Construct new fastify mongoose rest object
 * @param {Object} Model Mongoose model
 * @param {Object} options Options object
 * @param {Boolean} options.runValidators Run validators on update
 * @param {Boolean} options.returnNewOnUpdate Return new on update
 * @param {Boolean} options.upsertOnUpdate Upsert value on update
 */
module.exports = function construct(Model, options = {}) {
  if (!Model) {
    throw new Error('Model is required argument');
  }

  return {
    find: createSearchHandler(Model),
    findOne: createSearchHandler(Model, { findOne: true }),
    search: createSearchHandler(Model, { post: true }),
    create: createInsertHandler(Model),
    update: createUpdateHandler(Model, {
      runValidators: options.runValidators || true,
      new: options.returnNewOnUpdate || true,
      upsert: options.upsertOnUpdate || false,
    }),
    remove: createRemoveHandler(Model),
  };
};
