import mongoose from "mongoose";
import request from "supertest";
import userModel from "../models/user_model";
import { Express } from "express";
import initApp from "../server";

let app: Express;
let userId: string;
let validToken: string;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();

  const testUser = {
    email: "testUser@test.com",
    username: "Test User",
    password: "testPassword",
    profileImage: "testPhoto.jpg",
    bio: "I love testing!",
  };

  const createdUser = await userModel.create(testUser);
  userId = createdUser._id.toString();

  const loginResponse = await request(app).post("/auth/login").send({
    email: testUser.email,
    password: testUser.password,
  });

  validToken = loginResponse.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Controller Tests", () => {
  const authHeader = { Authorization: `Bearer ${validToken}` };

  test("GET /user/:id - Get User Profile", async () => {
    const response = await request(app).get(`/user/${userId}`).set(authHeader);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe("testUser@test.com");
    expect(response.body.username).toBe("Test User");
    expect(response.body.profileImage).toBe("testPhoto.jpg");
    expect(response.body.bio).toBe("I love testing!");
  });

  test("GET /user - Get all users", async () => {
    const response = await request(app).get("/user").set(authHeader);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /user/:id - Get User Profile (User not found)", async () => {
    const nonExistentUserId = "123456789012345678901234";
    const response = await request(app)
      .get(`/user/${nonExistentUserId}`)
      .set(authHeader);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("PATCH /user/:id - Update User Profile with only username provided", async () => {
    const updatedProfile = {
      username: "New Username"
    };
  
    const response = await request(app)
      .patch(`/user/${userId}`)
      .set(authHeader)
      .send(updatedProfile);
  
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(updatedProfile.username);
    expect(response.body.profileImage).toBe("testPhoto.jpg"); // Assuming original profileImage remains unchanged
    expect(response.body.bio).toBe("I love testing!"); // Assuming original bio remains unchanged
  });
  

  test("DELETE /user/:id - Delete User (User not found)", async () => {
    const nonExistentUserId = "123456789012345678901234";
    const response = await request(app)
      .delete(`/user/${nonExistentUserId}`)
      .set(authHeader);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(undefined);
  });

  test("DELETE /user/:id - Invalid User ID Format", async () => {
    const response = await request(app)
      .delete("/user/invalid-id")
      .set(authHeader);
    expect([400, 404, 500]).toContain(response.status); // ייתכן שתחזירי 400/404/500
  });
});
