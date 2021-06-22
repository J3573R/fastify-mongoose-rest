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
