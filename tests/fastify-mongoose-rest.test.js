const Mongoose = require('mongoose');
const Server = require('./fixture/server');
const Resource = require('./fixture/resource.model');
const User = require('./fixture/user.model');

describe('fastify-mongoose-rest', () => {
  const server = Server();

  let user;
  let user2;
  let resource;
  let resource2;

  beforeEach(async () => {
    user = await User.create({
      name: 'first-user'
    });
    user2 = await User.create({
      name: 'second-user'
    });
    resource = await Resource.create({
      content: 'first-resource',
      owner: user._id,
      approvers: [
        user2._id
      ]
    });
    resource2 = await Resource.create({
      content: 'second-resource',
      owner: null,
      approvers: []
    });
  });

  afterEach(async () => {
    await User.remove({});
    await Resource.remove({});
  });

  afterAll(() => {
    Mongoose.disconnect();
  });

  describe('find function', () => {
    it('should get all resources', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/resources'
      });

      const body = JSON.parse(response.body);

      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(2);
    });

    it('should accept populate parameter in query (string)', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/resources',
        query: {
          populate: 'owner approvers'
        },
      });

      const body = JSON.parse(response.body);
      expect(body[0]).toHaveProperty('owner');
      expect(body[0]).toHaveProperty('approvers');
      expect(body[0].owner).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String)
        })
      );
      expect(body[0].approvers[0]).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String)
        })
      );
    });

    it('should accept populate parameter in query (object)', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/resources',
        query: {
          populate: JSON.stringify({ path: 'owner' })
        },
      });

      const body = JSON.parse(response.body);

      expect(body[0]).toHaveProperty('owner');
      expect(body[0].owner).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String)
        })
      );
    });

    it('should accept limit & skip', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/resources',
        query: {
          skip: 0,
          limit: 1,
        },
      });

      const body = JSON.parse(response.body);
      expect(body).toHaveLength(1);
      expect(response.headers['x-total-count']).toEqual(2);
    });

    it('should accept projection query parameter', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/resources',
        query: {
          projection: '-_id',
        },
      });

      const body = JSON.parse(response.body);
      expect(body).toHaveLength(2);
      expect(body[0]).not.toHaveProperty("_id");
    });

    it('should accept sort query parameter', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/resources',
        query: {
          sort: '-content',
        },
      });

      const body = JSON.parse(response.body);
      expect(body).toHaveLength(2);
      expect(body[0]._id).toEqual(resource2._id.toString());
    });

  });

  describe('findOne function', () => {
    it('should get one resource', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/resources/${resource._id}`
      });

      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('_id');
      expect(body._id).toEqual(resource._id.toString());
    });

    it('should accept populate parameter in query (string)', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/resources/${resource._id}`,
        query: {
          populate: 'owner approvers'
        },
      });

      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('owner');
      expect(body).toHaveProperty('approvers');
      expect(body.owner).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String)
        })
      );
      expect(body.approvers[0]).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String)
        })
      );
    });

    it('should accept populate parameter in query (object)', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/resources/${resource._id}`,
        query: {
          populate: JSON.stringify({ path: 'owner' })
        },
      });

      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('owner');
      expect(body.owner).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String)
        })
      );
    });

    it('should accept projection query parameter', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/resources/${resource._id}`,
        query: {
          projection: '-_id',
        },
      });

      const body = JSON.parse(response.body);

      expect(body).not.toHaveProperty("_id");
      expect(body).toHaveProperty("content");
    });
  });

  describe('search function', () => {
    it('should get all resources', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/resources/search'
      });

      const body = JSON.parse(response.body);

      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(2);
    });

    it('should accept populate parameter in query (string)', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/resources/search',
        body: {
          populate: 'owner approvers'
        },
      });

      const body = JSON.parse(response.body);
      expect(body[0]).toHaveProperty('owner');
      expect(body[0]).toHaveProperty('approvers');
      expect(body[0].owner).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String)
        })
      );
      expect(body[0].approvers[0]).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String)
        })
      );
    });

    it('should accept populate parameter in query (object)', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/resources/search',
        body: {
          populate: JSON.stringify({ path: 'owner' })
        },
      });

      const body = JSON.parse(response.body);

      expect(body[0]).toHaveProperty('owner');
      expect(body[0].owner).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String)
        })
      );
    });

    it('should accept limit & skip', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/resources/search',
        body: {
          skip: 0,
          limit: 1,
        },
      });

      const body = JSON.parse(response.body);
      expect(body).toHaveLength(1);
      expect(response.headers['x-total-count']).toEqual(2);
    });

    it('should accept projection query parameter', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/resources/search',
        body: {
          projection: '-_id',
        },
      });

      const body = JSON.parse(response.body);
      expect(body).toHaveLength(2);
      expect(body[0]).not.toHaveProperty("_id");
    });

    it('should accept sort query parameter', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/resources/search',
        body: {
          sort: '-content',
        },
      });

      const body = JSON.parse(response.body);
      expect(body).toHaveLength(2);
      expect(body[0]._id).toEqual(resource2._id.toString());
    });

  });

  describe('create function', () => {
    it('should create new resource', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/resources',
        body: {
          content: 'third-resource',
        },
      });

      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('_id');
      expect(body).toHaveProperty('content');
      expect(body.content).toEqual('third-resource');
    });

    it('should return an error response if required parameters were not given', async () => {
      
      const response = await server.inject({
        method: 'POST',
        url: '/resources',
        body: {
        },
      });

      const body = JSON.parse(response.body);

      expect(body).toEqual(expect.objectContaining({
        'statusCode': 500,
        'error': 'Internal Server Error',
        'message': 'resource validation failed: content: Path `content` is required.'
      }));
    });
  });

  describe('update function', () => {
    it('should update the model', async () => {
      const response = await server.inject({
        method: 'PATCH',
        url: `/resources/${resource._id}`,
        body: {
          content: 'altered-content'
        }
      });

      const body = JSON.parse(response.body);

      expect(body.content).toEqual('altered-content');

      const alteredResource = await Resource.findById(resource._id);

      expect(body.content).toEqual(alteredResource.content);
    });
  });

  describe('remove function', () => {
    it('should delete resource', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/resources/${resource._id}`,
      });
  
      const body = JSON.parse(response.body);
      expect(body).toEqual(
        expect.objectContaining({
          n: 1,
          ok: 1,
          deletedCount: 1
        })
      );

      const removedResource = await Resource.findById(resource._id);

      expect(removedResource).toBeFalsy();
    })
  });

});
