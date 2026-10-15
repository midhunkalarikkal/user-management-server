import bcrypt from "bcryptjs";
import {
    setAuthCookies,
    setAccessCookie,
    clearAuthCookies,
    verifyRefreshToken,
} from "../utils/auth-tokens.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import type { Request, Response } from "express";
import { loginSchema } from "../schemas/auth.schema.js";

const demoUser = {
    name: "Demo User",
    email: env.DEMO_EMAIL,
};

export const login = async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        throw new AppError(
            400,
            "Invalid login data",
            result.error.flatten().fieldErrors,
        );
    }

    const { email, password } = result.data;

    const isPasswordValid = await bcrypt.compare(
        password,
        env.DEMO_PASSWORD_HASH,
    );

    const isEmailValid =
        email.toLowerCase() === env.DEMO_EMAIL.toLowerCase();

    if (!isEmailValid || !isPasswordValid) {
        throw new AppError(401, "Invalid credentials");
    }

    setAuthCookies(res);

    res.status(200).json({
        success: true,
        message: "Login successful",
        user: demoUser,
    });
};

export const getCurrentUser = (
    _req: Request,
    res: Response,
) => {
    res.status(200).json({
        success: true,
        user: demoUser,
    });
};

export const refresh = (req: Request, res: Response) => {
    const token: unknown = req.cookies?.refreshToken;

    if (
        typeof token !== "string" ||
        !verifyRefreshToken(token)
    ) {
        throw new AppError(
            401,
            "Invalid or expired refresh token",
        );
    }

    setAccessCookie(res);

    res.status(200).json({
        success: true,
        message: "Access token refreshed",
    });
};

export const logout = (_req: Request, res: Response) => {
    clearAuthCookies(res);

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};
