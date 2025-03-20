import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";
import postsModel from "../models/post_model";


let app: Express;

type UserInfo = {
  email: string;
  password: string;
  username: string;
  accessToken?: string;
  refreshToken?: string;
  _id?: string;
};

const userInfo: UserInfo = {
  email: "linoy@gmail.com",
  password: "123456",
  username: "linoy"
};

const register: UserInfo = {
  email: "register@test.com",
  username: "register",
  password: "testPassword"
};

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await postsModel.deleteMany();

});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Tests", () => {
  test("Auth Registration", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body).toHaveProperty("_id");
    
    // שמירת הטוקנים לשימוש בטסטים הבאים
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;
    userInfo._id = response.body._id;
  });

  test("Auth Registration fail", async () => {
    const response = await request(app).post("/auth/register").send({});
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Missing email, password or name ");
  });

  test("Auth Login", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password
    });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body).toHaveProperty("_id");

    // עדכון הטוקנים
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;
  });

  test("Make sure two access tokens are not the same", async () => {
    const oldAccessToken = userInfo.accessToken;
    const oldRefreshToken = userInfo.refreshToken;

    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password
    });

    expect(response.body.accessToken).not.toBe(oldAccessToken);
    expect(response.body.refreshToken).not.toBe(oldRefreshToken);

    // עדכון הטוקנים
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;
  });

  test("Get protected API", async () => {
    const response = await request(app).post("/post").send({
      userId: "invalid owner",
      title: "My First post",
      description: "This is my first post",
    });
    expect(response.statusCode).not.toBe(201);

    const response2 = await request(app).post("/post").set({
      authorization: 'JWT' + userInfo.accessToken
    }).send({
      userId: "invalid owner",
      title: "My First post",
      description: "This is my first post",
    });
    expect(response2.statusCode).toBe(201);
  });

  test("Get protected API invalid token", async () => {
    const response = await request(app).post("/post").set({
      authorization: 'JWT' + userInfo.accessToken+"1"
    }).send({
      userId: userInfo._id,
      title: "My First post",
      description: "This is my first post",
    });
    expect(response.statusCode).not.toBe(201);
  });

  test("Refresh Token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: userInfo.refreshToken });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");

    // עדכון הטוקנים
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;
  });

  test("Logout - invalidate refresh token", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .send({ refreshToken: userInfo.refreshToken });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Logged out successfully");

    // וידוא שה-refresh token לא תקף יותר
    const refreshResponse = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: userInfo.refreshToken });

    expect(refreshResponse.statusCode).toBe(400);
    expect(refreshResponse.text).toBe("invalid token");
  });

  test("Refresh token multiple usage", async () => {
    // התחברות מחדש לקבלת טוקנים
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        email: userInfo.email,
        password: userInfo.password
      });

    expect(loginResponse.statusCode).toBe(200);
    const oldRefreshToken = loginResponse.body.refreshToken;

    // שימוש ראשון בט��קן - אמור להצליח
    const firstRefresh = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: oldRefreshToken });

    expect(firstRefresh.statusCode).toBe(200);
    expect(firstRefresh.body).toHaveProperty("accessToken");
    expect(firstRefresh.body).toHaveProperty("refreshToken");

    // שימוש שני באותו טוקן - אמור להיכשל
    const secondRefresh = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: oldRefreshToken });

    expect(secondRefresh.statusCode).toBe(400);
    expect(secondRefresh.text).toBe("invalid token");
  });

  jest.setTimeout(10000);
  test("timeout on refresh access token", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;

    //wait for 6 seconds
    await new Promise(resolve => setTimeout(resolve, 6000));

    //try to access with expired token
    const response2 = await request(app).post("/post").set({
      authorization: 'JWT ' + userInfo.accessToken
    }).send({
      userId: "invalid owner",
      title: "My First post",
      descriptio: "This is my first post",
    });
    expect(response2.statusCode).not.toBe(201);

    const response3 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken
    });
    expect(response3.statusCode).toBe(200);
    userInfo.accessToken = response3.body.accessToken;
    userInfo.refreshToken = response3.body.refreshToken;

    const response4 = await request(app).post("/post").set({
      authorization: 'jwt ' + userInfo.accessToken
    }).send({
      userId: "invalid owner",
      title: "My First post",
      description: "This is my first post",
    });
    expect(response4.statusCode).toBe(201);
  });


  test("Refresh token multiple usage", async () => {
    // 🔹 שלב 1: התחברות לקבלת טוקנים חדשים
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        email: userInfo.email,
        password: userInfo.password
      });
  
    console.log("🔍 Step 1 - Login Response:", loginResponse.body);
    expect(loginResponse.statusCode).toBe(200);
  
    const accessToken = loginResponse.body.accessToken;
    const refreshToken = loginResponse.body.refreshToken;
    console.log("🔍 Received Tokens:", accessToken, refreshToken);
  
    // 🔹 שלב 2: שימוש ראשון בטוקן - אמור להצליח
    const firstRefresh = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken });
  
    console.log("🔍 Step 2 - First Refresh Response:", firstRefresh.body);
    expect(firstRefresh.statusCode).toBe(200);
    expect(firstRefresh.body).toHaveProperty("accessToken");
    expect(firstRefresh.body).toHaveProperty("refreshToken");
  
    // 🔹 שלב 3: שימוש שני באותו טוקן - אמור להיכשל
    const secondRefresh = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken });
  
    console.log("🔍 Step 3 - Second Refresh Response:", secondRefresh.body);
    expect(secondRefresh.statusCode).toBe(400);
    expect(secondRefresh.text).toBe("invalid token");
  });


  test("test Token Generation on Registration", async () => {
    const userInfo = {
      email: "new@example.com",
      password: "Test12345!",
      username: "TestRegistration"
    };

    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });

  test("test Successful Logout", async () => {
    const userInfo = {
      email: "test.logout@example.com",
      password: "Test12345!",
      username: "TestLogout"
    };

    await request(app).post("/auth/register").send(userInfo);
    const loginResponse = await request(app).post("/auth/login").send(userInfo);
    const refreshToken = loginResponse.body.refreshToken;

    const response = await request(app).post("/auth/logout").send({ refreshToken });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Logged out successfully");
  });

  // test("test Google Signin Missing Email", async () => {
  //   const response = await request(app)
  //     .post("/auth/google")
  //     .send({ credential: "credential-missing-email" });

  //   expect(response.status).toBe(400);
  //   expect(response.text).toBe("Email not provided in Google credentials");
  // });

  // test("test Missing JWT Configuration", async () => {
  //   const originalJwtSecret = process.env.JWT_SECRET;
  //   const originalJwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    
  //   process.env.JWT_SECRET = "";
  //   process.env.JWT_REFRESH_SECRET = "";

  //   const userInfo = {
  //     email: "test.jwt@example.com",
  //     password: "Test12345!",
  //     username: "TestJWT"
  //   };

  //   const response = await request(app).post("/auth/register").send(userInfo);
  //   expect(response.status).toBe(500);
  //   expect(response.text).toBe("Failed to generate tokens");

  //   // Restore original values
  //   process.env.JWT_SECRET = originalJwtSecret;
  //   process.env.JWT_REFRESH_SECRET = originalJwtRefreshSecret;
  // });

  // test("test Logout Invalid Refresh Token", async () => {
  //   const response = await request(app)
  //     .post("/auth/logout")
  //     .send({ refreshToken: "invalid-refresh-token" });

  //   expect(response.status).toBe(400);
  //   expect(response.body.status).toBe("error");
  //   expect(response.body.message).toBe("Invalid refresh token");
  // });

});