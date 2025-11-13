import request from 'supertest';
import app from '../src/app.js';

async function authToken() {
  const email = `user${Date.now()}@test.com`;
  const reg = await request(app).post('/api/auth/register').send({ email, password: 'Passw0rd!' });
  return reg.body.data.token as string;
}

describe('Category API', () => {
  it('creates root and child categories and returns tree', async () => {
    const token = await authToken();

    const root = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Electronics' })
      .expect(201);

    const child = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Mobiles', parentId: root.body.data._id })
      .expect(201);

    const res = await request(app)
      .get('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Electronics');
    expect(res.body.data[0].children[0].name).toBe('Mobiles');
  });

  it('cascades inactive status to descendants', async () => {
    const token = await authToken();

    const root = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Fashion' })
      .expect(201);

    const child = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Men', parentId: root.body.data._id })
      .expect(201);

    await request(app)
      .put(`/api/category/${root.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'inactive' })
      .expect(200);

    const tree = await request(app)
      .get('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(tree.body.data[0].status).toBe('inactive');
    expect(tree.body.data[0].children[0].status).toBe('inactive');
  });

  it('reassigns children to grandparent when deleting parent', async () => {
    const token = await authToken();

    const root = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Home' })
      .expect(201);

    const mid = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Furniture', parentId: root.body.data._id })
      .expect(201);

    const leaf = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Tables', parentId: mid.body.data._id })
      .expect(201);

    await request(app)
      .delete(`/api/category/${mid.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const tree = await request(app)
      .get('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const home = tree.body.data.find((n: any) => n.name === 'Home');
    const tables = home.children.find((n: any) => n.name === 'Tables');
    expect(tables).toBeTruthy();
  });
});
