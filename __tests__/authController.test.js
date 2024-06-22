import request from 'supertest';
import app from '../server.js'; 
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth Controller', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .field('username', 'testuser')
      .field('email', 'testuser@example.com')
      .field('password', 'password123')
      .field('userType', 'creador')
      .field('language', 'en')
      .attach('profileImage', '__tests__/files/profile.jpg');
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'USER_CREATED');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('token');
  });
});
