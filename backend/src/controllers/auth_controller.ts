import { Request, Response, NextFunction } from "express";
import userModel from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("missing email or password");
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      email: email,
      password: hashedPassword,
    });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("wrong email or password");
  }
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).send("wrong email or password");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("wrong email or password");
    }
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRATION) {
      return res.status(400).send("missing auth configuration");
    }
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: parseInt(process.env.JWT_EXPIRATION as string) || "1h" }
    );
    return res.status(200).send({
      email: user.email,
      _id: user._id,
      refreshToken: token,
    });
  } catch (err) {
    return res.status(400);
  }
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
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).send("missing token");
    return;
  }
  if (!process.env.JWT_SECRET) {
    res.status(400).send("missing auth configuration");
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      res.status(403).send("invalid token");
      return;
    }
    const payload = data as TokenPayload;
    req.query.userId = payload._id;
    next();
  });
};

export default { register, login };
