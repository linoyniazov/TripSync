import express, { Request, Response, NextFunction } from "express";
import userModel from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client();

const googleSignin = async (req: Request, res: Response) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log("Token verified successfully:", ticket.getPayload());

    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email || email.trim() === "") {
      // 🛠️ לוודא שלא ריק
      return res.status(400).send("Email not provided in Google credentials");
    }

    let user = await userModel.findOne({ email: email });

    if (!user) {
      // יצירת משתמש חדש
      user = await userModel.create({
        username: payload.name,
        email: email,
        password: " ",
        profileImage: payload.picture,
        refreshTokens: [], // מאתחלים מערך ריק
      });
    }

    // יצירת טוקנים חדשים
    const tokens = generateTokens(user._id.toString());
    if (!tokens) {
      return res.status(500).send("Failed to generate tokens");
    }

    // עדכון מערך ה-refresh tokens
    if (!user.refreshTokens) {
      user.refreshTokens = [];
    }
    user.refreshTokens = [tokens.refreshToken]; // מחליף את כל הטוקנים בחדש
    await user.save();

    // שליחת התשובה
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err: any) {
    console.error("Google sign in error:", err);
    return res.status(400).send(err.message);
  }
};

const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const profileImage =
      req.body.profileImage || "http://localhost:5000/public/avatar.jpeg";

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
      // refreshTokens: [], // Initialize refreshTokens array
    });
    
    // Generate tokens
    const tokens = generateTokens(user._id);
    if (!tokens) {
      return res.status(500).send("Failed to generate tokens");
    }

    // Add refresh token to user's refreshTokens array
    user.refreshTokens = [tokens.refreshToken];
    await user.save(); // Save the updated user

    return res.status(201).send({
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

  const accessToken = jwt.sign(
    { _id: _id, random: random },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRATION || "24h" } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    { _id: _id, random: random },
    jwtRefreshSecret,
    { expiresIn: "7d" } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Wrong username or password");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send("Wrong username or password");
    }

    const tokens = generateTokens(user._id);

    if (!user.refreshTokens) {
      user.refreshTokens = [];
    }
    if (tokens) {
      user.refreshTokens = [tokens.refreshToken]; // מחליפים את כל הרשימה בחדש
    }
    await user.save();

    res.status(200).json({
      accessToken: tokens?.accessToken,
      refreshToken: tokens?.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};
const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      status: "error",
      message: "Refresh token is required",
    });
  }

  try {
    // מוצאים את המשתמש עם הטוקן הזה
    const user = await userModel.findOne({ refreshTokens: refreshToken });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid refresh token",
      });
    }

    if (user.refreshTokens) {
      user.refreshTokens = []; // ✅ מוחק את כל ה-Tokens
    }

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
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

        // ✅ יצירת Access Token ו-Refresh Token חדשים
        const newTokens = generateTokens(user._id.toString());
        if (!newTokens) {
          res.status(500).send("Failed to generate new tokens");
          return;
        }

        // ❗ מחליפים את כל ה-Refresh Tokens בחדש
        user.refreshTokens = [newTokens.refreshToken];
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
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).send("missing token");
    return;
  }
  if (!process.env.JWT_SECRET) {
    res.status(500).send("missing auth configuration");
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      console.error("JWT verification failed:", err);
      res.status(401).send("Invalid or expired token");
      return;
    }
    const payload = data as TokenPayload;
    (req as any).user = payload._id;
    console.log("Extracted User ID:", (req as any).user);
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
