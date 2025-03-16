import { Express } from 'express';
import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import PostInteraction, {IPostInteraction, IComment} from '../models/post_interaction_model';
import Post, {IPost} from "../models/post_model";
import { beforeAll, afterAll } from '@jest/globals';
import User, { IUser } from "../models/user_model";

let app: Express;
let accessToken: string;

// Create a test user
const testUser: IUser = {
    email: "testUserPostInteraction@test.com",
    username: "Test User Post Interaction",
    password: "testPostInteractionPassword",
    profileImage: "testPostInteractionPhoto.jpg",
    bio: "I love testing with Post Interaction!",
  };

beforeAll(async() => {
    app = await initApp();
    console.log("beforeAll");
    await PostInteraction.deleteMany();
    await Post.deleteMany();
    const registerResponse = await request(app)
    .post("/auth/register")
    .send(testUser);
    const loginResponse = await request(app).post("/auth/login").send(testUser);
    accessToken = loginResponse.body.accessToken;
    testUser._id = loginResponse.body.userId; // Store the user ID for later use
})

afterAll(async() => {
    await mongoose.connection.close();
})

describe('Post Interaction API test', () => {
    
    let postId: string;

    test('Test Get All Posts - empty response', async () => {
        const response = await request(app).get("/postInteraction").set("authorization", `JWT ${accessToken}`);
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
            userId: testUser._id, // Use the correct user ID
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

    test('Test Get Posts By Location', async () => {
      const location = 'Test Location';
      const response = await request(app).get(`/postInteraction/location/${location}`).set("authorization", `JWT ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].location).toBe(location);
    });

    test('Test Get Posts By User', async () => {
      const response = await request(app) .get(`/postInteraction/user/${testUser._id}`)
      .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].userId).toBe(testUser._id);
    });

    test('Test Get Comments By Post Id', async () => {
      const userId = 'someUserId';
      const comment = 'This is a test comment';
      const response = await request(app).get(`/postInteraction/postId/${postId}`).set("authorization", `JWT ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].postId).toBe(postId);
      expect(response.body[0].comments).toHaveLength(1);
      expect(response.body[0].comments[0].userId).toBe(userId);
      expect(response.body[0].comments[0].comment).toBe(comment);
    });
    
});