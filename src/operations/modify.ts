import {FastifyReply, FastifyRequest} from 'fastify';
import {Model} from 'mongoose';
import {FastifyMongooseRestOptions} from '../types';
import {createResponseSchema, updatePropertiesRecursive} from '../utils';

export function Modify<T>(
  basePath: string,
  model: Model<T>,
  options: FastifyMongooseRestOptions
): {
  method: 'PATCH';
  url: string;
  schema: {
    summary: string;
    tags?: string[];
    params: object;
    body: object;
    response: object;
  };
  handler: (
    request: FastifyRequest<{
      Params: {
        id: string;
      };
      Body: {[index: string]: any};
    }>,
    reply: FastifyReply
  ) => Promise<any>;
} {
  const {tags, validationSchema, findProperty} = options;

  let body: any = {type: 'object'};
  let response = {};

  if (validationSchema) {
    body = {
      type: 'object',
      properties: {
        ...validationSchema,
      },
    };
    delete body.properties._id;
    response = createResponseSchema(validationSchema, 'object');
  }

  return {
    method: 'PATCH',
    url: `${basePath}/:id`,
    schema: {
      summary: `Modify a existing ${model.modelName} resource`,
      tags,
      params: {
        type: 'object',
        properties: {
          id: {type: 'string'},
        },
      },
      body,
      response,
    },
    handler: async (request, reply) => {
      const query = {
        [findProperty || '_id']: request.params.id,
      } as any;

      let resource = await model.findOne(query).exec();
      if (!resource) {
        return reply.code(404).send(new Error('Resource not found'));
      }
      resource = updatePropertiesRecursive(resource, request.body);
      await model.updateOne(query, {$set: resource as any});

      return reply.send(resource);
    },
  };
}
