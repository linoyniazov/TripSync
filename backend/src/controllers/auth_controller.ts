import express, { Request, Response, NextFunction } from "express";
import userModel from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client();

const googleSignin = async (req: Request, res: Response) => {
    console.log(req.body);
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (email != null) {
      let user = await userModel.findOne({ email: email });
      if (user == null) {
        user = await userModel.create({
         username: payload.name,
          email: email,
          password: "",
          profileImage: payload.picture,
        });
      }
      const tokens = generateTokens(user.id); // Fix: Pass the user's ID as a string
      res.status(200).send({
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        ...tokens,
      });
    }
  } catch (err: any) {
    return res.status(400).send(err.message);
  }
};
const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const profileImage = req.body.profileImage || "https://example.com/default-avatar.jpg";

    if (!username || !email || !password) {
      return res.status(400).send("Missing email, password or name ");
    }
    // Check if user already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(406).send("Email already exists");
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
      profileImage: profileImage,
      // refreshTokens: [] // Initialize refreshTokens array
    });
    // ✅ יצירת טוקנים
    const tokens = generateTokens(user._id);
    if (!tokens) {
      return res.status(500).send("Failed to generate tokens");
    }
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error registering user");
  }
};

const generateTokens = (
  _id: string
): { accessToken: string; refreshToken: string } | null => {
  const random = Math.random().toString();
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || !jwtRefreshSecret) {
    throw new Error("Missing JWT configuration");
  }

  const accessToken = jwt.sign({ _id: _id, random }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRATION || "24h",
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ _id: _id, random }, jwtRefreshSecret, {
    expiresIn: "7d",
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("wrong username or password");
      return;
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).send("wrong username or password");
      return;
    }
    if (!process.env.JWT_SECRET) {
      res.status(500).send("Server Error");
      return;
    }
    // generate token
    const tokens = generateTokens(user._id);
    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshTokens) {
      user.refreshTokens = [];
    }
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(400).send("missing refresh token");
    return;
  }
  //first validate the refresh token
  if (!process.env.JWT_REFRESH_SECRET) {
    res.status(400).send("missing auth configuration");
    return;
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err: any, data: any) => {
      if (err) {
        res.status(403).send("invalid token");
        return;
      }
      const payload = data as TokenPayload;
      try {
        const user = await userModel.findOne({ _id: payload._id });
        if (!user) {
          res.status(400).send("invalid token");
          return;
        }
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          res.status(400).send("invalid token");
          user.refreshTokens = [];
          await user.save();
          return;
        }
        const tokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        user.refreshTokens = tokens;
        await user.save();
        res.status(200).send("logged out");
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
      }
    }
  );
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(400).send("invalid token");
    return;
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    res.status(400).send("missing auth configuration");
    return;
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err: any, data: any) => {
      if (err) {
        res.status(403).send("invalid token");
        return;
      }
      const payload = data as TokenPayload;
      try {
        const user = await userModel.findOne({ _id: payload._id });
        if (!user) {
          res.status(400).send("invalid token");
          return;
        }
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          user.refreshTokens = [];
          await user.save();
          res.status(400).send("invalid token");
          return;
        }
        const newTokens = generateTokens(user._id.toString());
        if (!newTokens) {
          user.refreshTokens = [];
          await user.save();
          res.status(400).send("missing auth configuration");
          return;
        }

        user.refreshTokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        user.refreshTokens.push(newTokens.refreshToken);
        await user.save();

        res.status(200).send({
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        });
      } catch (err) {
        res.status(400).send("invalid token");
      }
    }
  );
};

type TokenPayload = {
  _id: string;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header("authorization");
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    res.status(401).send("Access Denied");
    return;
  }
  if (!process.env.JWT_SECRET) {
    res.status(500).send("Server Error");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      res.status(401).send("Access Denied");
      return;
    }
    req.params.userId = (payload as TokenPayload)._id;
    next();
  });
};
export default {
  register: register as unknown as express.RequestHandler,
  login: login as unknown as express.RequestHandler,
  refresh: refresh as unknown as express.RequestHandler,
  logout: logout as unknown as express.RequestHandler,
  generateTokens,
  googleSignin: googleSignin as unknown as express.RequestHandler,
};