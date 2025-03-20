// import mongoose from "mongoose";
// import request from "supertest";
// import userModel from "../models/user_model";
// import { Express } from "express";
// import initApp from "../server";

// let app: Express;
// let userId: string;
// let validToken: string;

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
//   const createdUser = await userModel.create(testUser);
//   userId = createdUser._id.toString();
//   const loginResponse = await request(app).post("/auth/login").send({
//     email: testUser.email,
//     password: testUser.password,
//   });
//   validToken = loginResponse.body.accessToken; 
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe("User Controller Tests", () => {
//   const authHeader = { Authorization: `Bearer ${validToken}` };
//   test("GET /user/:id - Get User Profile", async () => {
//     const response = await request(app).get(`/user/${userId}`).set(authHeader);
//     expect(response.status).toBe(200);

//     const user = response.body;
//     expect(user).toBeDefined();
//     expect(user.email).toBe("testUser@test.com");
//     expect(user.username).toBe("Test User");
//     expect(user.profileImage).toBe("testPhoto.jpg");
//     expect(user.bio).toBe("I love testing!");
//   });

//   test("GET /user/:id - Get User Profile (User not found)", async () => {
//     const nonExistentUserId = "123456789012345678901234";
//     const response = await request(app).get(`/user/${nonExistentUserId}`);
//     expect(response.status).toBe(404);
//     expect(response.body.message).toBe("User not found");
//   });

//   test("PATCH /user/:id - Update User Profile", async () => {
//     const updatedProfile = {
//       username: "Updated Name",
//       profileImage: "updatedPhoto.jpg",
//       bio: "Updated bio!",
//     };

//     const response = await request(app)
//       .patch(`/user/${userId}`).set(authHeader).send(updatedProfile);
//     expect(response.status).toBe(200);

//     const updatedUser = response.body;
//     expect(updatedUser).toBeDefined();
//     expect(updatedUser.username).toBe(updatedProfile.username);
//     expect(updatedUser.profileImage).toBe(updatedProfile.profileImage);
//     expect(updatedUser.bio).toBe(updatedProfile.bio);
//   });

//   test("PATCH /user/:id - Update User Profile (User not found)", async () => {
//     const nonExistentUserId = "123456789012345678901234";
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
//   test("DELETE /user/:id - Delete User Successfully", async () => {
//     const response = await request(app)
//       .delete(`/user/${userId}`).set(authHeader)
//       .expect(200);

//     expect(response.body).toEqual({ message: "User deleted successfully" });

//     // Verify user is actually deleted
//     const deletedUser = await userModel.findById(userId);
//     expect(deletedUser).toBeNull();
//   });

//   test("DELETE /user/:id - Delete User (User not found)", async () => {
//     const nonExistentUserId = "123456789012345678901234";
//     const response = await request(app)
//       .delete(`/user/${nonExistentUserId}`)
//       .expect(404);

//     expect(response.body).toEqual({ message: "User not found" });
//   });

//   test("DELETE /user/:id - Invalid User ID Format", async () => {
//     const response = await request(app)
//       .delete("/user/invalid-id")
//       .expect(500);

//     expect(response.body.message).toBe("Server error");
//   });

// });