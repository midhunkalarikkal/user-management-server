import axios from "axios";
import type {
    ErrorRequestHandler,
    RequestHandler,
} from "express";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/appError.js";

export const notFoundHandler: RequestHandler = (
    req,
    _res,
    next,
) => {
    next(
        new AppError(
            404,
            `Route ${req.method} ${req.path} not found`,
        ),
    );
};

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    req,
    res,
    next,
) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    let statusCode = 500;
    let message = "Internal server error";
    let details: unknown;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
    } else if (axios.isAxiosError(error)) {
        statusCode = 502;
        message = "Unable to retrieve data from the provider";

        if (error.code === "ECONNABORTED") {
            statusCode = 504;
            message = "Data provider request timed out";
        }
    } else if (
        error instanceof SyntaxError &&
        "status" in error &&
        error.status === 400 &&
        "body" in error
    ) {
        statusCode = 400;
        message = "Invalid JSON request body";
    }

    if (statusCode >= 500) {
        logger.error(
            {
                err: error,
                method: req.method,
                path: req.path,
                statusCode,
            },
            "Request failed",
        );
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(details !== undefined && { errors: details }),
    });
};
