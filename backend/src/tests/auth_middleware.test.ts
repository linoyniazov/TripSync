import request from "supertest";
import initApp from "../server";
import { Express } from "express";
import User, { IUser } from "../models/user_model";
import mongoose from "mongoose";

let app: Express;
let testUserId: mongoose.Types.ObjectId;
let authToken: string;
// Create a test user
const testUser: IUser = {
  email: "testUser@test.com",
  username: "Test User",
  password: "testPassword",
  createdAt: new Date(), 

};

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({ email: testUser.email });
  const response = await request(app).post("/auth/register").send(testUser);
  testUserId = response.body._id;
  //console.log(testUserId);
  const response2 = await request(app).post("/auth/login").send({
    email: testUser.email,
    password: "testPassword",
  });
  authToken = response2.body.accessToken;
  console.log(authToken);
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Middleware Tests", () => {
  test("should return 401 if auth token is missing", async () => {
    const response = await request(app).get(`/user/${testUserId}`);
    expect(response.status).toBe(401);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get(`/user/${testUserId}`)
      .set("Authorization", "JWT 1" + authToken);
    expect(response.statusCode).toBe(401);
  });

  test("should return 200 if auth token is valid", async () => {
    const response = await request(app)
      .get(`/user/${testUserId}`)
      .set("Authorization", `JWT ${authToken}`);
    expect(response.status).toBe(200);
  });
});