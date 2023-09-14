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
    create: Create(newBasePath, model, options),
    delete: Delete(newBasePath, model, options),
    details: Details(newBasePath, model, options),
    modify: Modify(newBasePath, model, options),
    list: List(newBasePath, model, options),
    search: Search(newBasePath, model, options),
    insertMany: InsertMany(newBasePath, model, options),
  };
}
