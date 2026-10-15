import { env } from "../config/env.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { CookieOptions, Response } from "express";

const ACCESS_TOKEN_SECONDS = 60 * 60;
const REFRESH_TOKEN_SECONDS = 2 * 24 * 60 * 60;

const secure = env.NODE_ENV === "production" || env.COOKIE_SAME_SITE === "none";

const sharedCookieOptions: CookieOptions = {
  httpOnly: true,
  secure,
  sameSite: env.COOKIE_SAME_SITE,
};

export const signAccessToken = () =>
  jwt.sign({ type: "access" }, env.JWT_ACCESS_SECRET, {
    subject: "demo-user",
    expiresIn: ACCESS_TOKEN_SECONDS,
    algorithm: "HS256",
  });

export const signRefreshToken = () =>
  jwt.sign({ type: "refresh" }, env.JWT_REFRESH_SECRET, {
    subject: "demo-user",
    expiresIn: REFRESH_TOKEN_SECONDS,
    algorithm: "HS256",
  });

export const verifyRefreshToken = (token: string): boolean => {
  try {
    const payload: string | JwtPayload = jwt.verify(token, env.JWT_REFRESH_SECRET, {
      algorithms: ["HS256"],
    });

    return typeof payload !== "string" && payload.sub === "demo-user" && payload.type === "refresh";
  } catch {
    return false;
  }
};

export const setAuthCookies = (res: Response) => {
  res.cookie("accessToken", signAccessToken(), {
    ...sharedCookieOptions,
    path: "/api",
    maxAge: ACCESS_TOKEN_SECONDS * 1000,
  });

  res.cookie("refreshToken", signRefreshToken(), {
    ...sharedCookieOptions,
    path: "/api/auth",
    maxAge: REFRESH_TOKEN_SECONDS * 1000,
  });
};

export const setAccessCookie = (res: Response) => {
  res.cookie("accessToken", signAccessToken(), {
    ...sharedCookieOptions,
    path: "/api",
    maxAge: ACCESS_TOKEN_SECONDS * 1000,
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", {
    ...sharedCookieOptions,
    path: "/api",
  });

  res.clearCookie("refreshToken", {
    ...sharedCookieOptions,
    path: "/api/auth",
  });
};
