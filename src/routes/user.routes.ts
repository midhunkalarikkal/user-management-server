import { Router } from "express";
import {
  getUsersController,
  filterUsersController,
  getUserByIdController,
  deleteUserController,
  createUserController,
  updateUserController,
  searchUsersController,
} from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get("/filter", filterUsersController);

usersRouter.get("/search", searchUsersController);

usersRouter.get("/:userId", getUserByIdController);

usersRouter.get("/", getUsersController);

usersRouter.post("/", createUserController);

usersRouter.put("/:userId", updateUserController);

usersRouter.delete("/:userId", deleteUserController);

export default usersRouter;
