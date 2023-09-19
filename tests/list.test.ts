import TestSetup from './util/setup';
import {createMockPerson, createMultipleMockCats} from './util/mock-data';
import supertest from 'supertest';

describe('list', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    request = await TestSetup();
  });

  beforeEach(async () => {
    const people = [
      await createMockPerson({
        name: 'a',
      }),
      await createMockPerson({
        name: 'b',
      }),
      await createMockPerson({
        name: 'c',
      }),
      await createMockPerson({
        name: 'd',
      }),
      await createMockPerson({
        name: 'e',
      }),
    ];

    for (const person of people) {
      await createMultipleMockCats(5, person._id);
    }
  });

  const queryTests: [
    /**
     * Test description
     */
    string,
    {
      /**
       * Query parameters
       */
      [key: string]: string | number | boolean;
    },
    {
      /**
       * Expected results length
       */
      length: number;
      /**
       * Expected first document name
       */
      first: string;
      /**
       * Expected last document name
       */
      last: string;
      /**
       * Expected properties in returned documents
       */
      property?: {
        [key: string]: unknown;
      };
      /**
       * Properties expected not to be in returned documents
       */
      notProperty?: string[];
      /**
       * Expected headers
       */
      headers?: {
        [key: string]: string | undefined;
      };
    },
  ][] = [
    [
      'should return list of documents',
      {},
      {
        length: 5,
        first: 'a',
        last: 'e',
      },
    ],
    [
      'should return list of documents with skip',
      {skip: 3},
      {
        length: 2,
        first: 'd',
        last: 'e',
      },
    ],
    [
      'should return list of documents with limit',
      {limit: 4},
      {
        length: 4,
        first: 'a',
        last: 'd',
      },
    ],
    [
      'should return list of documents with skip and limit',
      {skip: 2, limit: 2},
      {
        length: 2,
        first: 'c',
        last: 'd',
      },
    ],
    [
      'should return specific list of documents with "query" filter',
      {query: JSON.stringify({name: 'a'})},
      {
        length: 1,
        first: 'a',
        last: 'a',
      },
    ],
    [
      'should return specific list of documents with "q" filter',
      {q: JSON.stringify({name: 'b'})},
      {
        length: 1,
        first: 'b',
        last: 'b',
      },
    ],
    [
      'should populate information to returned documents',
      {populate: 'cats'},
      {
        length: 5,
        first: 'a',
        last: 'e',
        property: {
          'cats.length': 5,
        },
      },
    ],
    [
      'should populate information to returned documents from object',
      {populate: JSON.stringify({path: 'cats'})},
      {
        length: 5,
        first: 'a',
        last: 'e',
        property: {
          'cats.length': 5,
        },
      },
    ],
    [
      'should sort returned documents',
      {sort: '-name motto'},
      {
        length: 5,
        first: 'e',
        last: 'a',
      },
    ],
    [
      'should sort returned documents from comma separated',
      {sort: '-name,motto'},
      {
        length: 5,
        first: 'e',
        last: 'a',
      },
    ],
    [
      'should sort returned documents from object',
      {sort: JSON.stringify({name: -1, motto: 1})},
      {
        length: 5,
        first: 'e',
        last: 'a',
      },
    ],
    [
      'should return header X-Total-Count with total count of documents if totalCount parameter is true',
      {totalCount: true},
      {
        length: 5,
        first: 'a',
        last: 'e',
        headers: {
          'x-total-count': '5',
        },
      },
    ],
    [
      'should not return header X-Total-Count if totalCount parameter is not present',
      {},
      {
        length: 5,
        first: 'a',
        last: 'e',
        headers: {
          'x-total-count': undefined,
        },
      },
    ],
    [
      'should return only properties defined in projection',
      {projection: 'name -_id'},
      {
        length: 5,
        first: 'a',
        last: 'e',
        property: {
          name: expect.any(String),
        },
        notProperty: ['_id'],
      },
    ],
    [
      'should parse comma separated parameters defined in projection',
      {projection: 'name,-_id'},
      {
        length: 5,
        first: 'a',
        last: 'e',
        property: {
          name: expect.any(String),
        },
        notProperty: ['_id'],
      },
    ],
    [
      'should parse object defined parameters in projection',
      {projection: JSON.stringify({name: 1, _id: 0})},
      {
        length: 5,
        first: 'a',
        last: 'e',
        property: {
          name: expect.any(String),
        },
        notProperty: ['_id'],
      },
    ],
    [
      'should select what is returned in documents',
      {select: 'name -_id'},
      {
        length: 5,
        first: 'a',
        last: 'e',
        property: {
          name: expect.any(String),
        },
        notProperty: ['_id', 'motto', 'address'],
      },
    ],
    [
      'should parse comma separated parameters defined in select',
      {select: 'name,-_id'},
      {
        length: 5,
        first: 'a',
        last: 'e',
        property: {
          name: expect.any(String),
        },
        notProperty: ['_id', 'motto', 'address'],
      },
    ],
    [
      'should parse object defined parameters in select',
      {select: JSON.stringify({name: 1, _id: 0})},
      {
        length: 5,
        first: 'a',
        last: 'e',
        property: {
          name: expect.any(String),
        },
        notProperty: ['_id', 'motto', 'address'],
      },
    ],
    [
      'should return amount of documents defined in pageSize and page',
      {pageSize: 3, page: 1},
      {
        length: 2,
        first: 'd',
        last: 'e',
      },
    ],
    [
      'should return amount of documents defined in pageSize and default page 1',
      {pageSize: 3}, // page defaults to 0
      {
        length: 3,
        first: 'a',
        last: 'c',
      },
    ],
    [
      'should return amount of documents defined in pageSize and default page 2',
      {pageSize: 3, page: -1}, // page defaults to 0 if negative
      {
        length: 3,
        first: 'a',
        last: 'c',
      },
    ],
    [
      'should return amount of documents defined in page and default pageSize 1',
      {page: 0}, // pageSize defaults to 100
      {
        length: 5,
        first: 'a',
        last: 'e',
      },
    ],
    [
      'should return amount of documents defined in page and default pageSize 2',
      {page: 0, pageSize: 0}, // pageSize defaults to 100 if zero or negative
      {
        length: 5,
        first: 'a',
        last: 'e',
      },
    ],
  ];

  test.each(queryTests)(
    '%s',
    async (_, query, {length, first, last, property, notProperty, headers}) => {
      const {body, header} = await request
        .get('/persons')
        .expect(200)
        .expect('Content-Type', /json/)
        .query(query);

      expect(Array.isArray(body)).toEqual(true);
      expect(body.length).toEqual(length);
      expect(body.at(0).name).toEqual(first);
      expect(body.at(-1).name).toEqual(last);

      if (property) {
        Object.entries(property).forEach(([key, value]) => {
          body.forEach((doc: object) => {
            expect(doc).toHaveProperty(key, value);
          });
        });
      }

      if (notProperty) {
        body.forEach((doc: object) => {
          notProperty.forEach(key => {
            expect(doc).not.toHaveProperty(key);
          });
        });
      }

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          expect(header[key]).toEqual(value);
        });
      }
    }
  );
});
