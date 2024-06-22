import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

let token;
let categoryId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user = new User({
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    userType: 'admin',
  });
  await user.save();

  token = jwt.sign({ id: user._id, role: user.userType }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Category Controller', () => {
  it('should create a category', async () => {
    const res = await request(app)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Images')
      .attach('coverImage', '__tests__/files/cover.jpg');
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('name', 'Images');
    categoryId = res.body.data._id;
  });

  it('should get categories', async () => {
    const res = await request(app)
      .get('/api/admin/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('should get a category by id', async () => {
    const res = await request(app)
      .get(`/api/admin/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('_id', categoryId);
  });

  it('should update a category', async () => {
    const res = await request(app)
      .put(`/api/admin/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Images',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('name', 'Updated Images');
  });

  it('should delete a category', async () => {
    const res = await request(app)
      .delete(`/api/admin/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'CATEGORY_DELETED');
  });
});
