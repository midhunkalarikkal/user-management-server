import jwt from "jsonwebtoken";
import type {
  Request,
  Response,
  NextFunction,
} from "express";
import { env } from "../config/env.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token: unknown = req.cookies?.accessToken;

  if (typeof token !== "string") {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
      { algorithms: ["HS256"] },
    );

    if (
      typeof payload === "string" ||
      payload.sub !== "demo-user" ||
      payload.type !== "access"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
      return;
    }

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
