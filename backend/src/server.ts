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
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import aiRoute from "./routes/ai_route";
import path from "path";



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/postInteraction", postInteraction);
app.use("/file", fileRoute);
app.use("/public", express.static("public"));
app.use("/storage", express.static("storage"));
app.use("/ai", aiRoute);
app.use("/auth", authRoute);


const options = {
  definition: {
  openapi: "3.0.0",
  info: {
  title: "TripSync API",
  version: "1.0.0",
  description: "REST server including authentication using JWT",
  },

  servers: [{url: "http://localhost:" + process.env.PORT ,},
  {url: "http://10.10.246.36",},
  {url: "https://10.10.246.36",},
  {url: "https://node36.cs.colman.ac.il"}],
  },
  apis: ["./src/routes/*.ts"],
  };
// Swagger (לפני זה)
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.static("front"));
app.use((req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../../front/index.html"));
});

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connected to the database");
    });
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




