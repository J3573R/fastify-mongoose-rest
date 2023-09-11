import {FastifyReply, FastifyRequest, HTTPMethods} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '../types';
import {createResponseSchema, updatePropertiesRecursive} from '../utils';

export function Modify(
  basePath: string,
  model: Model<any>,
  options?: FastifyMongooseRestOptions
): {
  method: HTTPMethods;
  url: string;
  schema: {
    summary: string;
    tags: string[];
    params: object;
    body: object;
    response: object;
  };
  handler: any;
} {
  let body: any = {type: 'object'};
  let response = {};

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
    method: 'PATCH',
    url: `${basePath}/:id`,
    schema: {
      summary: `Modify a existing ${model.modelName} resource`,
      tags: options?.tags || [],
      params: {
        type: 'object',
        properties: {
          id: {type: 'string'},
        },
      },
      body,
      response,
    },
    handler: async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: {[index: string]: any};
      }>,
      reply: FastifyReply
    ) => {
      const findQuery: {[name: string]: string} = {};
      findQuery[options?.findProperty || '_id'] = request.params.id;

      let resource = await model.findOne(findQuery);
      resource = updatePropertiesRecursive(resource, request.body);
      await model.updateOne(findQuery, {$set: resource});

      return reply.send(resource);
    },
  };
}
