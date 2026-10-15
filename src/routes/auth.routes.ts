import { Router } from "express";
import { login, logout, refresh, getCurrentUser } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/refresh", refresh);

authRouter.post("/logout", logout);

authRouter.get("/me", authenticate, getCurrentUser);

export default authRouter;
