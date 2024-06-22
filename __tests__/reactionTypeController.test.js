import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import ReactionType from '../models/ReactionType.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

let token;
let reactionTypeId;

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

describe('Reaction Type Controller', () => {
  it('should create a reaction type', async () => {
    const res = await request(app)
      .post('/api/admin/reaction-types')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Like',
        icon: 'fa-thumbs-up',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('name', 'Like');
    reactionTypeId = res.body.data._id;
  });

  it('should get reaction types', async () => {
    const res = await request(app)
      .get('/api/admin/reaction-types')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('should get a reaction type by id', async () => {
    const res = await request(app)
      .get(`/api/admin/reaction-types/${reactionTypeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('_id', reactionTypeId);
  });

  it('should update a reaction type', async () => {
    const res = await request(app)
      .put(`/api/admin/reaction-types/${reactionTypeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Like',
        icon: 'fa-thumbs-up',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('name', 'Updated Like');
  });

  it('should delete a reaction type', async () => {
    const res = await request(app)
      .delete(`/api/admin/reaction-types/${reactionTypeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'REACTION_TYPE_DELETED');
  });
});
