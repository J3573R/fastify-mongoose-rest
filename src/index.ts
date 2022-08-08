import {Model} from 'mongoose';

import Details from './operations/details';
import Create from './operations/create';
import Modify from './operations/modify';
import List from './operations/list';
import Search from './operations/search';
import Delete from './operations/delete';

export interface FastifyMongooseRestOptions {
  /**
   * Faster / Ajv validation schema
   */
  validationSchema?: object;
  /**
   * Swagger tags for schema generation
   */
  tags?: string[];
  /**
   * Add automatically X-Total-Count header to search endpoints
   */
  enableTotalCountHeader?: boolean;
}

export default function FastifyMongooseRest(
  name: string,
  model: Model<any>,
  options?: FastifyMongooseRestOptions
) {
  return {
    create: Create(name, model, options),
    delete: Delete(name, model),
    details: Details(name, model, options),
    modify: Modify(name, model, options),
    list: List(name, model, options),
    search: Search(name, model, options),
  };
}
