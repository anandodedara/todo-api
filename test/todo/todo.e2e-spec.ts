import * as request from 'supertest';
import { APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';

////////////////////////////////////////////////////////////////

describe('Todos (e2e)', () => {
  const app = APP_URL;
  let newUserFirst;
  const newUserEmailFirst = `user-first.${Date.now()}@example.com`;
  const newUserPasswordFirst = `secret`;
  let apiToken;

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/admin/email/login')
      .send({ email: newUserEmailFirst, password: newUserPasswordFirst })
      .then(({ body }) => {
        apiToken = body.token;
      });

    await request(app)
      .post('/api/v1/auth/email/register')
      .send({
        email: newUserEmailFirst,
        password: newUserPasswordFirst,
        firstName: `First${Date.now()}`,
        lastName: 'E2E',
      });

    await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: newUserEmailFirst, password: newUserPasswordFirst })
      .then(({ body }) => {
        newUserFirst = body.user;
        apiToken = body.token;
      });
  });

  it('create new todo: /api/v1/todos (POST)', () => {
    return request(app)
      .post(`/api/v1/todos`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({
        title: 'Todo 1',
        description: 'Todo 1',
        status: false,
      })
      .expect(201);
  });

  it('Get list of all todos with pagination: /api/v1/todos (GET)', () => {
    return request(app)
      .get(`/api/v1/todos`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .query({ page: '1', limit: '10' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.hasNextPage).toBeDefined();
      });
  });


  it('Can not Get list of all todos without authorization: /api/v1/todos (GET)', () => {
    return request(app)
      .get(`/api/v1/todos`)
      .query({ page: '1', limit: '10' })
      .expect(401)
  });

  it('Get list of all todos: hasNextPage must be false while no more items present: /api/v1/todos (GET)', () => {
    return request(app)
      .get(`/api/v1/todos`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .query({ page: '1', limit: '1000' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.hasNextPage).toBe(false);
      });
  });

  it('Delete a todo', async () => {
    const response = await request(app)
      .post(`/api/v1/todos`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({
        title: 'Todo 1',
        description: 'Todo 1',
        status: false,
      });
    const todo = response.body.id;
    return request(app)
      .delete(`/api/v1/todos/${todo}`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send()
      .expect(204);
  });

  it('Update a todo', async () => {
    const response = await request(app)
      .post(`/api/v1/todos`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({
        title: 'Todo 1',
        description: 'Todo 1',
        status: false,
      });
    const todo = response.body.id;
    await request(app)
      .patch(`/api/v1/todos/${todo}`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({
        title: 'Updated Todo 1',
      })
      .expect(200);

    await request(app)
      .get(`/api/v1/todos/${todo}`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send()
      .expect(200)
      .expect(({ body }) => {
        expect(body.title).toBe('Updated Todo 1');
      });
  });
});
