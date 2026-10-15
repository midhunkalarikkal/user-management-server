import jwt from "jsonwebtoken";
import type {
    Request,
    Response,
    NextFunction,
} from "express";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const token: unknown = req.cookies?.accessToken;

    if (typeof token !== "string") {
        return next(
            new AppError(401, "Authentication required"),
        );
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
            throw new AppError(401, "Invalid access token");
        }

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }

        return next(
            new AppError(
                401,
                "Invalid or expired access token",
            ),
        );
    }
};
