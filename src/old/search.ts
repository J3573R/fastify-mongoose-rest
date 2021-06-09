import util from 'util';
import { Document, Model } from 'mongoose';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Creates search handler
 *
 * @param {Object} Model Mongoose model
 * @param {Object} options
 * @param {Object} options.post Use post as source of parameters
 * @param {Object} options.findOne Determine if id is required in parameters
 */
function createSearchHandler(
  model: Model<any>,
  options: { post?: boolean; findOne?: boolean },
) {
  return (routeOptions: { filter: any; projection: any }) =>
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: any;
        Querystring: any;
      }>,
      reply: FastifyReply,
    ) => {
      // Selects source according to options. Defaults on query string but uses body
      // if options.post is true.
      let source = request.query;
      if (options && options.post === true && request.body) {
        source = request.body;
      }

      let queryParameters = source.query || source.q;

      if (queryParameters && typeof queryParameters !== 'object') {
        queryParameters = JSON.parse(queryParameters);
      }

      if (
        routeOptions &&
        routeOptions.filter &&
        typeof routeOptions.filter === 'function'
      ) {
        queryParameters = {
          ...queryParameters,
          ...routeOptions.filter(request, reply),
        };
      }

      // QUERY
      let query;
      let countQuery;
      if (options && options.findOne === true) {
        if (!request.params.id) {
          throw new Error('Id is required parameter.');
        }
        query = model.findOne({ _id: request.params.id });
        countQuery = model.findOne({ _id: request.params.id });
      } else {
        query = model.find(queryParameters);
        countQuery = model.find(queryParameters);
      }

      // POPULATE
      let { populate } = source;
      if (populate) {
        // If populate starts with '{', let's assume it's object and try to parse it
        if (typeof populate === 'string' && populate.trim().startsWith('{')) {
          populate = JSON.parse(populate);
        }

        // Populate has to have keys, otherwise it will throw an error
        if (Object.keys(populate).length > 0) {
          query.populate(populate);
        }
      }

      // PROJECTION
      let projection = source.projection || source.select || false;
      if (projection) {
        if (
          typeof projection === 'string' &&
          projection.trim().startsWith('{')
        ) {
          projection = JSON.parse(projection);
        }
        query.projection(projection);
      }

      // SKIP
      let skip = source.skip || source.page || source.p || 0;
      if (skip) {
        if (typeof skip !== 'number') {
          skip = parseInt(skip, 10);
        }
        query.skip(skip);
      }

      // LIMIT
      let limit = source.limit || source.pageSize;
      if (limit) {
        if (typeof limit !== 'number') {
          limit = parseInt(limit, 10);
        }
        query.limit(limit);
      }

      // SORT
      let { sort } = source;
      if (sort) {
        // If populate starts with '{', let's assume it's object and try to parse it
        if (typeof sort === 'string' && sort.trim().startsWith('{')) {
          sort = JSON.parse(sort);
        }

        query.sort(sort);
      }

      let result = await query.exec();

      const count = await countQuery.countDocuments();

      reply.header('X-Total-Count', count);

      if (
        routeOptions.projection &&
        typeof routeOptions.projection === 'function'
      ) {
        const projectionFunc = util.promisify(routeOptions.projection);
        result = await projectionFunc(request, result);
      }

      return reply.send(result);
    };
}

export default createSearchHandler;
