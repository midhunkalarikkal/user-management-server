import axios from "axios";
import type { Request, Response, NextFunction } from "express";
import {
  getUsersQuerySchema,
  filterUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
} from "../schemas/users.schema.js";
import {
  getUsers,
  filterUsers,
  getUserById,
  deleteUser,
  createUser,
  updateUser,
} from "../services/users.service.js";
import { AppError } from "../utils/appError.js";

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const result = getUsersQuerySchema.safeParse(req.query);

  if (!result.success) {
    return next(new AppError(400, "Invalid query parameters", result.error.flatten().fieldErrors));
  }

  try {
    const data = await getUsers(result.data);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const filterUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const result = filterUsersQuerySchema.safeParse(req.query);

  if (!result.success) {
    return next(new AppError(400, "Invalid filter parameters", result.error.flatten().fieldErrors));
  }

  try {
    const data = await filterUsers(result.data);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.params.userId);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return next(new AppError(400, "Invalid user ID"));
  }

  try {
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new AppError(400, "Invalid user ID");
  }

  try {
    const result = await deleteUser(userId);

    res.status(200).json(result);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new AppError(404, "User not found");
    }

    throw error;
  }
};

export const createUserController = async (req: Request, res: Response) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, "Invalid user data", result.error.flatten().fieldErrors);
  }

  const user = await createUser(result.data);

  res.status(201).json(user);
};

export const updateUserController = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new AppError(400, "Invalid user ID");
  }

  const result = updateUserSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, "Invalid user data", result.error.flatten().fieldErrors);
  }

  try {
    const user = await updateUser(userId, result.data);

    res.status(200).json(user);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new AppError(404, "User not found");
    }

    throw error;
  }
};
