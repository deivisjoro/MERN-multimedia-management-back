import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

let token;
let topicId;

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

describe('Topic Controller', () => {
  it('should create a topic', async () => {
    const res = await request(app)
      .post('/api/admin/topics')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Nature',
        allowedContentTypes: [],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('name', 'Nature');
    topicId = res.body.data._id;
  });

  it('should get topics', async () => {
    const res = await request(app)
      .get('/api/admin/topics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('should get a topic by id', async () => {
    const res = await request(app)
      .get(`/api/admin/topics/${topicId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('_id', topicId);
  });

  it('should update a topic', async () => {
    const res = await request(app)
      .put(`/api/admin/topics/${topicId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Nature',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('name', 'Updated Nature');
  });

  it('should delete a topic', async () => {
    const res = await request(app)
      .delete(`/api/admin/topics/${topicId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'TOPIC_DELETED');
  });
});
