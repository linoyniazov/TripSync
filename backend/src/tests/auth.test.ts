import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

type UserInfo = {
  email: string;
  password: string;
  token?: string;
  _id?: string;
};
const userInfo: UserInfo = {
  email: "eliav@gmail.com",
  password: "123456"
}

describe("Auth Tests", () => {
  test("Auth Registration", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
  });

  test("Auth Login", async () => {
    const response = await request(app).post("/auth/login").send(userInfo);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    const token = response.body.token;
    expect(token).toBeDefined();
    const userId = response.body._id;
    expect(userId).toBeDefined();
    userInfo.token = token;
    userInfo._id = userId;
  });

  test("Get protected API", async () => {
    const response = await request(app).post("/posts").send({
      owner: userInfo._id,
      title: "My First post",
      content: "This is my first post",
    });
    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app).post("/posts").set({
      authorization: 'jwt ' + userInfo.token
    }).send({
      owner: userInfo._id,
      title: "My First post",
      content: "This is my first post",
    });
    expect(response2.statusCode).toBe(201);
  });
});