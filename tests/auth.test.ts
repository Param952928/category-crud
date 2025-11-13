import request from 'supertest';
import app from '../src/app.js';

describe('Auth API', () => {
  

  it('registers a user and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'a@b.com', password: 'Passw0rd!' })
      .expect(201);
    expect(res.body.data.token).toBeDefined();
  });

  it('prevents duplicate registration', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@b.com', password: 'Passw0rd!' })
      .expect(201);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@b.com', password: 'Passw0rd!' })
      .expect(409);
    expect(res.body.message).toMatch(/already/i);
  });

  it('logs in a user and returns token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@b.com', password: 'Passw0rd!' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@b.com', password: 'Passw0rd!' })
      .expect(200);
    expect(res.body.data.token).toBeDefined();
  });
});
