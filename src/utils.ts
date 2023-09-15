import {Model} from 'mongoose';
import {FindOptions} from './types';

/**
 * If input is string, try to parse it to an object and if not possible, return the string with commas replaced by spaces.
 * If input is object, return it as is.
 * @param input Input to parse
 * @returns Parsed input
 */
export function parseInput(input: string | object) {
  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch (_) {
      return input.replace(/,/g, ' ');
    }
  }
  return input;
}

/**
 * Add slash to path if it does not have one.
 * @param path Path to add slash to
 * @returns Path with slash at the start
 */
export function addSlashToPath(path: string) {
  return path[0] === '/' ? path : `/${path}`;
}

/**
 * Create response schema for a operation.
 * @param schema Schema to use for response
 * @param type Type of response. Either 'object' or 'array'
 * @returns Response schema
 */
export function createResponseSchema(
  schema: object,
  type: 'object' | 'array'
): Record<number, unknown> {
  let successResponse;
  if (type === 'object') {
    successResponse = {type: 'object', properties: schema};
  }
  if (type === 'array') {
    successResponse = {
      type: 'array',
      items: {
        type: 'object',
        properties: schema,
      },
    };
  }

  return {
    200: {
      description: 'Success',
      ...successResponse,
    },
    400: {
      description: 'Validation error',
      type: 'object',
      properties: {
        error: {type: 'string'},
        message: {type: 'string'},
      },
    },
    500: {
      description: 'Server error',
      type: 'object',
      properties: {
        error: {type: 'string'},
        message: {type: 'string'},
      },
    },
  };
}

/**
 * Update properties of object recursively.
 */
export function updatePropertiesRecursive(obj: any, changes: any) {
  Object.keys(changes).map(key => {
    if (typeof obj[key] === 'object' && typeof changes[key] === 'object') {
      if (changes[key] !== null) {
        obj[key] = updatePropertiesRecursive(obj[key], changes[key]);
      }
    } else {
      obj[key] = changes[key];
    }
  });
  return obj;
}

/**
 * Calculate skip and limit options from given page and
 * pageSize. If value is not given, use default values:
 * 0 for page and 100 for pageSize
 */
export function calculateSkipAndLimit(p?: number, pageSize?: number) {
  const requestedPage = p && p >= 0 ? p : 0;
  const requestedPageSize = pageSize && pageSize > 0 ? pageSize : 100;
  const skip = requestedPageSize * requestedPage;
  const limit = requestedPageSize;
  return {skip, limit};
}

/**
 * Create a find operation for mongoose model.
 * @param model Mongoose model to use
 * @param options Options for find operation
 * @returns Resources and totalCount if requested
 */
export async function findOperation<T>(model: Model<T>, options: FindOptions) {
  const {
    query,
    q,
    populate,
    projection,
    sort,
    select,
    skip,
    limit,
    p,
    page,
    pageSize,
    totalCount,
  } = options;

  const operation = model.find(parseInput(query || q || {}));

  if (populate) {
    operation.populate(parseInput(populate));
  }

  if (projection) {
    operation.projection(parseInput(projection));
  }

  if (sort) {
    operation.sort(parseInput(sort));
  }

  if (select) {
    operation.select(parseInput(select));
  }

  if (page !== undefined || p !== undefined || pageSize !== undefined) {
    const calculation = calculateSkipAndLimit(page || p, pageSize);
    operation.skip(calculation.skip);
    operation.limit(calculation.limit);
  } else {
    if (skip !== undefined && skip > 0) {
      operation.skip(skip);
    }

    if (limit !== undefined && limit > 0) {
      operation.limit(limit);
    }
  }

  const resources = await operation;

  if (totalCount === true) {
    const operationCount = await model
      .find(parseInput(query || q || {}))
      .countDocuments();
    return {resources, totalCount: operationCount};
  }

  return {resources};
}
