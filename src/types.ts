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

/**
 * Find options for mongoose
 */
export interface FindOptions {
  /**
   * Query for mongoose
   * @alias q
   */
  query?: object | string;
  /**
   * Query for mongoose
   * @alias query
   */
  q?: object | string;
  /**
   * Populate for mongoose
   */
  populate?: object | string;
  /**
   * Projection for mongoose
   */
  projection?: object | string;
  /**
   * Sort for mongoose
   */
  sort?: object | string;
  /**
   * Select for mongoose
   */
  select?: object | string;
  /**
   * Skip for mongoose
   */
  skip?: number;
  /**
   * Limit for mongoose
   */
  limit?: number;
  /**
   * Page for mongoose
   * @alias page
   */
  p?: number;
  /**
   * Page for mongoose
   * @alias p
   */
  page?: number;
  /**
   * Page size for mongoose
   */
  pageSize?: number;
  /**
   * Total count parameter for returning total count of documents of the query
   */
  totalCount?: boolean;
}

/**
 * Find options for mongoose
 */
export interface FindQueryOptions extends FindOptions {
  query?: string;
  q?: string;
  populate?: string;
  projection?: string;
  sort?: string;
  select?: string;
}
