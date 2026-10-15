import bcrypt from "bcryptjs";
import {
    clearAuthCookies,
    setAccessCookie,
    setAuthCookies,
    verifyRefreshToken,
} from "../utils/auth-tokens.js";
import { env } from "../config/env.js";
import type { Request, Response } from "express";
import { loginSchema } from "../schemas/auth.schema.js";

export const login = async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            success: false,
            message: "Invalid login data",
            errors: result.error.flatten().fieldErrors,
        });
        return;
    }

    const { email, password } = result.data;

    const isPasswordValid = await bcrypt.compare(
        password,
        env.DEMO_PASSWORD_HASH,
    );

    const isEmailValid =
        email.toLowerCase() === env.DEMO_EMAIL.toLowerCase();

    if (!isEmailValid || !isPasswordValid) {
        res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
        return;
    }

    setAuthCookies(res);

    res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            name: "demo-user",
            email: env.DEMO_EMAIL,
        },
    });
};

export const getCurrentUser = (
    _req: Request,
    res: Response,
) => {
    res.status(200).json({
        success: true,
        user: {
            name: "Demo User",
            email: env.DEMO_EMAIL,
        },
    });
};

export const refresh = (req: Request, res: Response) => {

    const token: unknown = req.cookies?.refreshToken;

    if (
        typeof token !== "string" ||
        !verifyRefreshToken(token)
    ) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
        });
        return;
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
