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
   * The name of the property that will be used as :id param on routes. If not set, _id will be used.
   */
  findProperty?: string;
}
