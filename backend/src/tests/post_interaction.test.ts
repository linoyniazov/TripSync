import { Express } from 'express';
import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import PostInteraction from '../models/post_interaction_model';
import Post from "../models/post_model";
import User from "../models/user_model";
import { IUser } from "../models/user_model";

let app: Express;
let accessToken: string;
const testUser: IUser = {
  email: "testUserPostInteraction@test.com",
  username: "Test User Post Interaction",
  password: "testPostInteractionPassword",
  profileImage: "testPostInteractionPhoto.jpg",
  bio: "I love testing with Post Interaction!",
};

beforeAll(async () => {
  app = await initApp();
  await PostInteraction.deleteMany();
  await Post.deleteMany();

  const registerResponse = await request(app)
    .post("/auth/register")
    .send(testUser);

  const loginResponse = await request(app).post("/auth/login").send(testUser);
  accessToken = loginResponse.body.accessToken;
  testUser._id = loginResponse.body.userId;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Post Interaction API test', () => {
  let postId: string;

  test('Test Get All Posts - empty response', async () => {
    const response = await request(app)
      .get("/postInteraction")
      .set("authorization", `JWT ${accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test('Test Create Post', async () => {
    const postResponse = await request(app)
      .post('/post')
      .set("authorization", `JWT ${accessToken}`)
      .send({
        city: 'Test Post',
        location: 'Test Location',
        description: 'Test Description',
        photos: ['photo1.jpg'],
        userId: testUser._id,
      });

    expect(postResponse.statusCode).toBe(201);
    expect(postResponse.body.city).toBe('Test Post');
    postId = postResponse.body._id;
  });

  test('Test Add Comment to Post Interaction', async () => {
    const userId = 'someUserId';
    const comment = 'This is a test comment';

    const response = await request(app)
      .post('/postInteraction/comment')
      .set("authorization", `JWT ${accessToken}`)
      .send({ postId, userId, comment });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Comment added successfully');

    const postInteraction = await PostInteraction.findOne({ postId });
    if (postInteraction?.comments) {
      expect(postInteraction.comments).toHaveLength(1);
      expect(postInteraction.comments[0].userId).toBe(userId);
      expect(postInteraction.comments[0].comment).toBe(comment);
    }
  });

  test('Test Get Comments By Post Id', async () => {
    const userId = 'someUserId';
    const comment = 'This is a test comment';
    const response = await request(app)
      .get(`/postInteraction/postId/${postId}`)
      .set("authorization", `JWT ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].postId).toBe(postId);
    expect(response.body[0].comments).toHaveLength(1);
    expect(response.body[0].comments[0].userId).toBe(userId);
    expect(response.body[0].comments[0].comment).toBe(comment);
  });

  test('test_getAllPosts_success', async () => {
    const postResponse = await request(app)
      .post('/post')
      .set("authorization", `JWT ${accessToken}`)
      .send({
        city: 'Test City',
        location: 'Test Location',
        description: 'Test Description',
        photos: ['photo1.jpg'],
        userId: testUser._id,
      });

    postId = postResponse.body._id;

    const response = await request(app)
      .get("/postInteraction")
      .set("authorization", `JWT ${accessToken}`)
      .query({ userId: testUser._id });

    expect(response.statusCode).toBe(200);

    const returnedPost = response.body.find((p: any) => p._id === postId);
    expect(returnedPost).toBeDefined();
    expect(returnedPost.isLikedByUser).toBe(false);
  });

  test('test_addComment_success', async () => {
    const userId = 'someUserId';
    const comment = 'This is a test comment';

    const response = await request(app)
      .post('/postInteraction/comment')
      .set("authorization", `JWT ${accessToken}`)
      .send({ postId, userId, comment });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Comment added successfully');

    const postInteraction = await PostInteraction.findOne({ postId });
    if (postInteraction?.comments) {
      expect(postInteraction.comments).toHaveLength(1);
      expect(postInteraction.comments[0].userId).toBe(userId);
      expect(postInteraction.comments[0].comment).toBe(comment);
    }
  });

  test('test_addLike_success', async () => {
    const userId = 'someUserId';

    const response = await request(app)
      .post('/postInteraction/like')
      .set("authorization", `JWT ${accessToken}`)
      .send({ postId, userId });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Like added successfully');
    expect(response.body.likesCount).toBe(1);
    expect(response.body.likedBy).toContain(userId);
  });

});
