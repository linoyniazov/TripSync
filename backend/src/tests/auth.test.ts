import request from "supertest";
import initApp from "../server";
import User from "../models/user_model";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;
const userLogIn = {
  email: "loginuser@example.com",
  password: "loginpassword",
  name: "User Log In",
};
const userData = {
  email: "test@example.com",
  password: "password123",
  name: "linoy",
};

describe("Auth Tests", () => {
  beforeAll(async () => {
    app = await initApp();
  });

  afterAll(async () => {
    await User.deleteMany({ email: userLogIn.email });
    await User.deleteMany({ email: userData.email });
    await mongoose.connection.close();
  });

  describe("POST /auth/register", () => {
    test("should register a new user", async () => {
      const response = await request(app).post("/auth/register").send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
    });

    test("should return 400 if missing email, password or name", async () => {
      const response = await request(app).post("/auth/register").send({});

      expect(response.status).toBe(400);
    });

    test("should return 406 if email already exists", async () => {
      const existingUser = {
        email: "existing@example.com",
        password: "existingpassword",
        name: "Existing User",
      };

      await request(app).post("/auth/register").send(existingUser);

      const response = await request(app)
        .post("/auth/register")
        .send(existingUser);

      expect(response.status).toBe(406);
    });
  });

  describe("POST /auth/login", () => {
    test("should login with correct credentials", async () => {
      // Register a user
      await request(app).post("/auth/register").send(userLogIn);

      // Login with correct credentials
      const response = await request(app).post("/auth/login").send({
        email: "loginuser@example.com",
        password: "loginpassword",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
    });

    test("should return 400 if missing email or password", async () => {
      const response = await request(app).post("/auth/login").send({});

      expect(response.status).toBe(400);
    });

    test("should return 401 if email or password incorrect", async () => {
      const userData = {
        email: "incorrect@example.com",
        password: "incorrectpassword",
      };

      const response = await request(app).post("/auth/login").send(userData);

      expect(response.status).toBe(401);
    });
  });
});