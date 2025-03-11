import { Express } from 'express';
import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import PostInteraction, {IPostInteraction, IComment} from '../models/post_interaction_model';
import Post, {IPost} from "../models/post_model";
import { beforeAll, afterAll } from '@jest/globals';

let app: Express;


beforeAll(async() => {
    app = await initApp();
    console.log("beforeAll");
    await PostInteraction.deleteMany();
    await Post.deleteMany();
})

afterAll(async() => {
    await mongoose.connection.close();
})

describe('Post Interaction API test', () => {
    
    let postId: string;

    test('Test Get All Posts - empty response', async () => {
        const response = await request(app).get("/postInteraction");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });
    
    test('Test Create Post', async () => {
        const postResponse = await request(app)
          .post('/post')
          .send({
            title: 'Test Post',
            location: 'Test Location',
            description: 'Test Description',
            photos: ['photo1.jpg'],
            userId: 'testUserId',
          });
    
        expect(postResponse.statusCode).toBe(201);
        expect(postResponse.body.title).toBe('Test Post');
        postId = postResponse.body._id;
    });

    test('Test Add Comment to Post Interaction', async () => {
        const userId = 'someUserId';
        const comment = 'This is a test comment';
    
        const response = await request(app)
          .post('/postInteraction/comment')
          .send({ postId, userId, comment });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Comment added successfully');
    
        const postInteraction = await PostInteraction.findOne({ postId });
        expect(postInteraction).toBeDefined();
        if (postInteraction && postInteraction.comments) {
            expect(postInteraction.comments).toHaveLength(1);
            expect(postInteraction.comments[0].userId).toBe(userId);
            expect(postInteraction.comments[0].comment).toBe(comment);
        } else {
            fail("Post interaction or comments are undefined");
        }
    });

    test('Test Get Posts By Location', async () => {
      const location = 'Test Location';
      const response = await request(app).get(`/postInteraction/location/${location}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].location).toBe(location);
    });

    test('Test Get Posts By User', async () => {
      const userId = 'testUserId';
      const response = await request(app).get(`/postInteraction/user/${userId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].userId).toBe(userId);
    });

    test('Test Get Comments By Post Id', async () => {
      const userId = 'someUserId';
      const comment = 'This is a test comment';
      const response = await request(app).get(`/postInteraction/postId/${postId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].postId).toBe(postId);
      expect(response.body[0].comments).toHaveLength(1);
      expect(response.body[0].comments[0].userId).toBe(userId);
      expect(response.body[0].comments[0].comment).toBe(comment);
    });
    
});
