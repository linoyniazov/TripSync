import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import { Express } from "express";

let app: Express;
let testUserId: string;
let accessToken: string;
// Create a test user
const testUser: IUser = {
  email: "testUser@test.com",
  name: "Test User",
  password: "testPassword",
  profilePhoto: "testPhoto.jpg",
  aboutMe: "I love testing!",
};
describe("User Controller Tests", () => {
  beforeAll(async () => {
    app = await initApp();

    const registerResponse = await request(app)
      .post("/auth/register")
      .send(testUser);
    const loginResponse = await request(app).post("/auth/login").send(testUser);
    accessToken = loginResponse.body.accessToken;

    testUserId = loginResponse.body.userId;
    console.log(testUserId);
  });

  afterAll(async () => {
    User.deleteMany({ email: testUser.email });
    await mongoose.connection.close();
  });
  test("should retrieve user profile with valid user ID and authentication token", async () => {
    const response = await request(app)
      .get(`/user/${testUserId}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);

    const userProfile = response.body.userProfile;
    expect(userProfile).toBeDefined();
    expect(userProfile.email).toBeDefined();
    expect(userProfile.Name).toBeDefined();
  });

  test("should handle case where user ID does not exist during profile retrieval", async () => {
    const nonExistentUserId = "123456789012345678901234"; // A non-existent user ID
    const response = await request(app)
      .get(`/user/${nonExistentUserId}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("should update user profile with valid user ID and authentication token", async () => {
    const updatedProfile = {
      name: "Updated Name",
      profilePhoto: "updatedPhoto.jpg",
      aboutMe: "Updated bio!",
    };

    const response = await request(app)
      .patch(`/user/${testUserId}`)
      .set("Authorization", `JWT ${accessToken}`)
      .send(updatedProfile);
    expect(response.status).toBe(200);

    const updatedUser = response.body;
    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toBe(updatedProfile.name);
    expect(updatedUser.profilePhoto).toBe(updatedProfile.profilePhoto);
    expect(updatedUser.aboutMe).toBe(updatedProfile.aboutMe);
  });

  test("should handle case where user ID for updating does not exist", async () => {
    const nonExistentUserId = "123456789012345678901234"; // A non-existent user ID
    const updatedProfile = {
      name: "Updated Name",
      profilePhoto: "updatedPhoto.jpg",
      aboutMe: "Updated bio!",
    };

    const response = await request(app)
      .patch(`/user/${nonExistentUserId}`)
      .set("Authorization", `JWT ${accessToken}`)
      .send(updatedProfile);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});