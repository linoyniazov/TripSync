import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthResquest extends Request {
  user?: { _id: string };
}

const authMiddleware = (
  req: AuthResquest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload as { _id: string };
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

export default authMiddleware;