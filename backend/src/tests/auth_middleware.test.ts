import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { _id: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!process.env.JWT_SECRET) {
    res.status(500).json({ error: "JWT secret not configured" });
    return;
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.sendStatus(401);
      return;
    }
    req.user = decoded as { _id: string };
    next(); // קריטי לקרוא ל-next()
  });
};

export default authMiddleware;
