import cors from "cors";
import helmet from "helmet";
import express from "express";
import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/user.routes.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

// to prevent exposing the framework details in the header
app.disable("x-powered-by");

app.use(helmet());

app.use(requestLogger);

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "User Management API is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
