import mongoose from "mongoose";
import request from "supertest";
import userModel from "../models/user_model";
import { Express } from "express";
import initApp from "../server";

let app: Express;
let userId: string;

beforeAll(async () => {
  console.log("beforeAll");
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
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Controller Tests", () => {
  test("GET /user/:id - Get User Profile", async () => {
    const response = await request(app).get(`/user/${userId}`);
    expect(response.status).toBe(200);

    const user = response.body;
    expect(user).toBeDefined();
    expect(user.email).toBe("testUser@test.com");
    expect(user.username).toBe("Test User");
    expect(user.profileImage).toBe("testPhoto.jpg");
    expect(user.bio).toBe("I love testing!");
  });

  test("GET /user/:id - Get User Profile (User not found)", async () => {
    const nonExistentUserId = "123456789012345678901234";
    const response = await request(app).get(`/user/${nonExistentUserId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("PATCH /user/:id - Update User Profile", async () => {
    const updatedProfile = {
      username: "Updated Name",
      profileImage: "updatedPhoto.jpg",
      bio: "Updated bio!",
    };

    const response = await request(app)
      .patch(`/user/${userId}`)
      .send(updatedProfile);
    expect(response.status).toBe(200);

    const updatedUser = response.body;
    expect(updatedUser).toBeDefined();
    expect(updatedUser.username).toBe(updatedProfile.username);
    expect(updatedUser.profileImage).toBe(updatedProfile.profileImage);
    expect(updatedUser.bio).toBe(updatedProfile.bio);
  });

  test("PATCH /user/:id - Update User Profile (User not found)", async () => {
    const nonExistentUserId = "123456789012345678901234";
    const updatedProfile = {
      username: "Updated Name",
      profileImage: "updatedPhoto.jpg",
      bio: "Updated bio!",
    };

    const response = await request(app)
      .patch(`/user/${nonExistentUserId}`)
      .send(updatedProfile);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});
// import mongoose from "mongoose";
// import request from "supertest";
// import userModel from "../models/user_model";
// import { Express } from "express";
// import initApp from "../server";

// let app: Express;
// let userId: string;

// beforeAll(async () => {
//   console.log("beforeAll");
//   app = await initApp(); 
//   await userModel.deleteMany();
//   const testUser = {
//     email: "testUser@test.com",
//     username: "Test User",
//     password: "testPassword",
//     profileImage: "testPhoto.jpg",
//     bio: "I love testing!",
//   };
//   const createdUser = await userModel.create(testUser); // Save the user in the database
//   userId = createdUser._id.toString(); // Save the created user's ID for further tests
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe("User Controller Tests", () => {
//   test("GET /user/:userId - Get User Profile", async () => {
//     const response = await request(app).get(`/user/${userId}`);
//     expect(response.status).toBe(200);

//     const userProfile = response.body.userProfile;
//     expect(userProfile).toBeDefined();
//     expect(userProfile.email).toBeDefined();
//     expect(userProfile.username).toBeDefined();
//     expect(userProfile.profileImage).toBeDefined();
//     expect(userProfile.bio).toBeDefined();
//   });

//   test("GET /user/:userId - Get User Profile (User not found)", async () => {
//     const nonExistentUserId = "123456789012345678901234"; // A non-existent user ID
//     const response = await request(app).get(`/user/${nonExistentUserId}`);
//     expect(response.status).toBe(404);
//     expect(response.body.message).toBe("User not found");
//   });

//   test("PATCH /user/:userId - Update User Profile", async () => {
//     const updatedProfile = {
//       username: "Updated Name",
//       profileImage: "updatedPhoto.jpg",
//       bio: "Updated bio!",
//     };

//     const response = await request(app)
//       .patch(`/user/${userId}`)
//       .send(updatedProfile);
//     expect(response.status).toBe(200);

//     const updatedUser = response.body;
//     expect(updatedUser).toBeDefined();
//     expect(updatedUser.username).toBe(updatedProfile.username);
//     expect(updatedUser.profileImage).toBe(updatedProfile.profileImage);
//     expect(updatedUser.bio).toBe(updatedProfile.bio);
//   });

//   test("PATCH /user/:userId - Update User Profile (User not found)", async () => {
//     const nonExistentUserId = "123456789012345678901234"; // A non-existent user ID
//     const updatedProfile = {
//       username: "Updated Name",
//       profileImage: "updatedPhoto.jpg",
//       bio: "Updated bio!",
//     };

//     const response = await request(app)
//       .patch(`/user/${nonExistentUserId}`)
//       .send(updatedProfile);
//     expect(response.status).toBe(404);
//     expect(response.body.message).toBe("User not found");
//   });
// });