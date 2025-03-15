import { Express } from "express";
import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";


let app: Express;

beforeAll(async() => {
    app = await initApp();
    console.log("beforeAll");
})

afterAll(async() => {
    await mongoose.connection.close();
})


describe("File Tests" , () => {
    test("upload file" , async () => {
     const filePath = `${__dirname }/avatar.jpeg` ;
     try {
        const response = await request(app)
            .post("/file/").attach('file', filePath)
        expect(response.statusCode ).toEqual(200);
        let url = response.body.url;
        url = url.replace(/^.*\/\/[^/]+/, '')
        const res = await request(app).get(url)
        expect(res.statusCode ).toEqual(200);
     } catch (err) {
        console.log(err);
        expect(1).toEqual(2);
     }
    });
});