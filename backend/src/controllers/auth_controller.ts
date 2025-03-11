import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  if (!email || !password || !name) {
    return res.status(400).send("Missing email, password or name ");
  }
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(406).send("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email: email,
      password: encryptedPassword,
      name: name,
    });
    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error registering user");
  }
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  }
  try {
    const user = await User.findOne({ email: email });
    //console.log("Found user:", user);
    if (!user) {
      return res.status(401).send("Email or password incorrect");
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match:", match);
    if (!match) {
      return res.status(401).send("Email or password incorrect");
    }

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );
    if (user.refreshTokens == null) {
      user.refreshTokens = [refreshToken];
    } else {
      user.refreshTokens.push(refreshToken);
    }
    await user.save();
    return res
      .status(200)
      .json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: user._id,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error logging in");
  }
};

const logout = async (req: Request, res: Response) => {
  // Extract the refresh token from the Authorization header
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  // Check if the refresh token is missing
  if (refreshToken == null) return res.sendStatus(401);
  // Verify the refresh token and extract the user ID from its payload
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      console.log(err);
      if (err) return res.sendStatus(401);
      try {
        // Find the user in the database based on the extracted user ID
        const userDb = await User.findOne({ _id: user._id });
        // Check if the user has refresh tokens and if the provided token is included
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          // If not, clear all refresh tokens for the user and return unauthorized
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        } else {
          // If the provided token is valid, remove it from the user's refresh tokens
          userDb.refreshTokens = userDb.refreshTokens.filter(
            (t) => t !== refreshToken
          );
          await userDb.save();
          return res.sendStatus(200);
        }
      } catch (err) {
        res.sendStatus(401).send(err.message);
      }
    }
  );
};

const refreshToken = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        console.log(err);
        return res.sendStatus(401);
      }
      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        }
        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET
        );
        userDb.refreshTokens = userDb.refreshTokens.filter(
          (t) => t !== refreshToken
        );
        userDb.refreshTokens.push(newRefreshToken);
        await userDb.save();
        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } catch (err) {
        res.sendStatus(401).send(err.message);
      }
    }
  );
};

export default {
  register,
  login,
  logout,
  refreshToken,
};