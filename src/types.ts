export interface FastifyMongooseRestOptions {
  /**
   * Faster / Ajv validation schema
   */
  validationSchema?: object;

  /**
   * Tags for OpenAPI documentation
   */
  tags?: string[];

  /**
   * The name of the property that will be used as :id param on routes. If not set, _id will be used.
   */
  findProperty?: string;
}

export interface FindOptions {
  query?: object | string;
  q?: object | string;
  populate?: object | string;
  projection?: object | string;
  sort?: object | string;
  select?: object | string;
  skip?: number;
  limit?: number;
  p?: number;
  page?: number;
  pageSize?: number;
  totalCount?: boolean;
}

export interface FindQueryOptions extends FindOptions {
  query?: string;
  q?: string;
  populate?: string;
  projection?: string;
  sort?: string;
  select?: string;
}
