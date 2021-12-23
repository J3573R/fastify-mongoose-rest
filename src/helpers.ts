/**
 * Try safely to parse input to object. Return string if not possible.
 */
export function parseInput(input: string) {
  try {
    const result = JSON.parse(input);
    return result;
  } catch (error) {
    return input;
  }
}

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
export function updatePropertiesRecursive(
  obj: Record<string, any>,
  changes: Record<string, any>
) {
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

export function calculateSkipAndLimit(
  p?: number,
  page?: number,
  pageSize?: number
) {
  const inputPage = p ? p : page ? page : undefined;
  const requestedPage = Number(inputPage) >= 0 ? Number(inputPage) : 0;
  const requestedPageSize = Number(pageSize) > 0 ? Number(pageSize) : 100;
  const skip = requestedPageSize * requestedPage;
  const limit = requestedPageSize + 1;
  return {skip, limit};
}
