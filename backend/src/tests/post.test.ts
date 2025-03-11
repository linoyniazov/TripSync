import { Express } from "express";
import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import Post, {IPost} from "../models/post_model";
import { beforeAll, afterAll } from '@jest/globals';

let app: Express;
beforeAll(async() => {
    app = await initApp();
    console.log("beforeAll");
    await Post.deleteMany();
})

afterAll(async() => {
    await mongoose.connection.close();
})

describe ("Post API test", ()=>{
    let postId: string;

    test("Test Get All Posts - empty response", async () => {
        const response = await request(app).get("/post");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

    test("Test Post creation", async () => {
        const post: IPost = {
          title: "Test Post",
          location: "Test Location",
          description: "Test Description",
          photos: ["photo1.jpg", "photo2.jpg"],
          userId: "testUserId",
        };
    
        const response = await request(app).post("/post").send(post);
        expect(response.statusCode).toBe(201);
    
        const postsAfterCreation = await request(app).get("/post");
        expect(postsAfterCreation.body.length).toBe(1);
        expect(postsAfterCreation.body[0].title).toBe("Test Post");
        expect(postsAfterCreation.body[0].location).toBe("Test Location");
        expect(postsAfterCreation.body[0].description).toBe("Test Description");
        expect(postsAfterCreation.body[0].photos).toEqual(["photo1.jpg", "photo2.jpg"]);
        expect(postsAfterCreation.body[0].userId).toBe("testUserId");
    });

    test("Test Get All Posts with one post in DB", async () => {
        const response = await request(app).get("/post");
        expect(response.statusCode).toBe(200);
        const firstPost = response.body[0];
        expect(firstPost.title).toBe("Test Post");
        expect(firstPost.location).toBe("Test Location");
        expect(firstPost.description).toBe("Test Description");
        expect(firstPost.userId).toBe("testUserId");
        postId = firstPost._id;
    });

    test("Test Get Post by ID", async () => {
        const response = await request(app).get(`/post/${postId}`);
        expect(response.statusCode).toBe(200);
        const postById = response.body;
        expect(postById.title).toBe("Test Post");
        expect(postById.location).toBe("Test Location");
        expect(postById.description).toBe("Test Description");
        expect(postById.userId).toBe("testUserId");
    });

    test("Test Update Post by ID", async () => {
        const updatedPost: IPost = {
          title: "Updated Test Post",
          location: "Updated Test Location",
          description: "Updated Test Description",
          photos: ["photo3.jpg", "photo4.jpg"],
          userId: "updatedTestUserId",
        };
    
        const response = await request(app).patch(`/post/${postId}`).send(updatedPost);
        expect(response.statusCode).toBe(200);
        const updatedPostById = response.body;
        expect(updatedPostById.title).toBe("Updated Test Post");
        expect(updatedPostById.location).toBe("Updated Test Location");
        expect(updatedPostById.description).toBe("Updated Test Description");
        expect(updatedPostById.photos).toEqual(["photo3.jpg", "photo4.jpg"]);
        expect(updatedPostById.userId).toBe("updatedTestUserId");
    });

    test("Test Delete Post by ID", async () => {
        const response = await request(app).delete(`/post/${postId}`);
        expect(response.statusCode).toBe(200);

        const postsAfterDeletion = await request(app).get("/post");
        expect(postsAfterDeletion.body.length).toBe(0);
    });

});