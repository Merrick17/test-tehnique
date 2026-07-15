import type {
  NextFunction,
  Request,
  Response,
} from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

type TokenPayload = JwtPayload & {
  userId: string;
};

export const verifyAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    if (typeof decoded === "string" || !("userId" in decoded)) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = (decoded as TokenPayload).userId;
    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
