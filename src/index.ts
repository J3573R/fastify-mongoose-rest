import {Model} from 'mongoose';
import {
  Details,
  Create,
  Modify,
  List,
  Search,
  Delete,
  InsertMany,
} from './operations';
import {FastifyMongooseRestOptions} from './types';
import {addSlashToPath} from './utils';

/**
 * Create a new FastifyMongooseRest instance
 *
 * @param basePath Base path for the routes. It will be prefixed to all routes
 * @param model Mongoose model to use
 * @param options Options for the routes
 * @returns FastifyMongooseRest instance
 *
 * @example
 * ```ts
 * import FastifyMongooseRest from 'fastify-mongoose-rest';
 * import Cat from './models/cat';
 *
 * // If the base path does not include a slash at the start, it will be added
 * const fastifyMongooseRest = FastifyMongooseRest('/cats', Cat);
 * ```
 */
export default function FastifyMongooseRest<T>(
  basePath: string,
  model: Model<T>,
  options: FastifyMongooseRestOptions = {}
) {
  const newBasePath = addSlashToPath(basePath);
  return {
    /**
     * Route for creating a new resource
     *
     * @description
     * Validates input with given {@link FastifyMongooseRestOptions.validationSchema validation schema} and returns the created resource
     *
     * @see {@link Model.create Mongooose create method}
     */
    create: Create(newBasePath, model, options),

    /**
     * Route for deleting a resource by it's identifier
     *
     * @description
     * Deletes a resource by _id or {@link FastifyMongooseRestOptions.findProperty findProperty option}
     *
     * @see {@link Model.deleteOne Mongooose deleteOne method}
     */
    delete: Delete(newBasePath, model, options),

    /**
     * Route for displaying a single resource by it's identifier
     *
     * @description
     * Returns a resource by _id or {@link FastifyMongooseRestOptions.findProperty findProperty option}
     *
     * @see {@link Model.findOne Mongooose findOne method}
     */
    details: Details(newBasePath, model, options),

    /**
     * Route for displaying modifying a resource by it's identifier
     *
     * @description
     * Validates input with given {@link FastifyMongooseRestOptions.validationSchema validation schema} and returns the modified resource
     *
     * @see {@link Model.findOne Mongooose findOne method}
     * @see {@link Model.updateOne Mongooose updateOne method}
     */
    modify: Modify(newBasePath, model, options),

    /**
     * Route for querying a list of resources
     *
     * @description
     * Returns a list of resources defined by the query parameters used in the request
     *
     * @see {@link Model.find Mongooose find method}
     */
    list: List(newBasePath, model, options),

    /**
     * Route for searching a list of resources
     *
     * @description
     * Returns a list of resources defined by the body used in the request
     *
     * @see {@link Model.find Mongooose find method}
     */
    search: Search(newBasePath, model, options),

    /**
     * Route for inserting many resources
     *
     * @description
     * Validates input with given {@link FastifyMongooseRestOptions.validationSchema validation schema} and returns the created resources
     *
     * @see {@link Model.insertMany Mongooose insertMany method}
     */
    insertMany: InsertMany(newBasePath, model, options),
  };
}
