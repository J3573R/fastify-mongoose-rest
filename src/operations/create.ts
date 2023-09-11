import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '../types';
import {createResponseSchema} from '../utils';

export default function Create(
  basePath: string,
  model: Model<any>,
  options?: FastifyMongooseRestOptions
): {
  method: HTTPMethods;
  url: string;
  schema: {
    summary: string;
    tags: string[];
    body: object;
    response: object;
  };
  handler: any;
} {
  let response: Record<number, any> = {};
  let body: Record<string, any> = {type: 'object'};

  if (options?.validationSchema) {
    body = {
      type: 'object',
      properties: {
        ...options.validationSchema,
      },
    };

    delete body.properties._id;

    response = createResponseSchema(options.validationSchema, 'object');
  }

  return {
    method: 'POST',
    url: basePath,
    schema: {
      summary: `Create a new ${model.modelName} resource`,
      tags: options?.tags || [],
      body,
      response,
    },
    handler: async (
      request: FastifyRequest<{
        Body: unknown;
      }>,
      reply: FastifyReply
    ) => {
      const resource = await model.create(request.body);
      return reply.send(resource);
    },
  };
}
