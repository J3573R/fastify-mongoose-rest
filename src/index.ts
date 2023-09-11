import {Model} from 'mongoose';

import Details from './operations/details';
import Create from './operations/create';
import Modify from './operations/modify';
import List from './operations/list';
import Search from './operations/search';
import Delete from './operations/delete';
import InsertMany from './operations/insert-many';
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
export default function FastifyMongooseRest(
  basePath: string,
  model: Model<any>,
  options?: FastifyMongooseRestOptions
) {
  return {
    create: Create(addSlashToPath(basePath), model, options),
    delete: Delete(addSlashToPath(basePath), model, options),
    details: Details(addSlashToPath(basePath), model, options),
    modify: Modify(addSlashToPath(basePath), model, options),
    list: List(addSlashToPath(basePath), model, options),
    search: Search(addSlashToPath(basePath), model, options),
    insertMany: InsertMany(addSlashToPath(basePath), model, options),
  };
}
