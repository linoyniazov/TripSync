import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import userRoute from "./routes/user_route";
import postRoute from "./routes/post_route";
import postInteraction from "./routes/post_interaction_route";
import fileRoute from "./routes/file_route";
import authRoute from "./routes/auth_route";


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/postInteraction", postInteraction);
app.use("/file", fileRoute);
app.use("/public", express.static("public"));
app.use("/auth", authRoute);


const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.MONGO_URI) {
      reject("MONGO_URI is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;