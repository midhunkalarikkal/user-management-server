import type {
    UsersTableColumn,
    ApiPaginatedResponse,
} from "../types/user.js";
import { dummyJsonApi } from "../lib/axios.js";
import type { DeleteUserResponse } from "../types/user.js";
import type { User, UserDetailsResponse } from "../types/user.js";
import type { CreateUserInput, FilterUsersParams, GetUsersParams, UpdateUserInput } from "../schemas/users.schema.js";
import bcrypt from "bcryptjs";

const toTableUser = (
    user: UsersTableColumn,
): UsersTableColumn => ({
    id: user.id,
    image: user.image,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    email: user.email,
    role: user.role,
});


// Get all users with pagination
export const getUsers = async ({
    page,
    limit,
    sortBy,
    order,
}: GetUsersParams): Promise<
    ApiPaginatedResponse<UsersTableColumn>
> => {
    const skip = (page - 1) * limit;

    const { data } = await dummyJsonApi.get<
        ApiPaginatedResponse<UsersTableColumn>
    >("/users", {
        params: {
            limit,
            skip,
            ...(sortBy && {
                sortBy,
                order: order ?? "asc",
            }),
        },
    });

    return {
        ...data,
        users: data.users.map(toTableUser),
    };
};


// Filter users
export const filterUsers = async ({
    page,
    limit,
    sortBy,
    order,
    key,
    value,
}: FilterUsersParams): Promise<
    ApiPaginatedResponse<UsersTableColumn>
> => {
    const skip = (page - 1) * limit;

    const { data } = await dummyJsonApi.get<
        ApiPaginatedResponse<UsersTableColumn>
    >("/users/filter", {
        params: {
            key,
            value,
            limit: 0,
        },
    });

    const users = data.users.map(toTableUser);

    if (sortBy) {
        const direction = order === "desc" ? -1 : 1;

        users.sort((a, b) => {
            if (sortBy === "age") {
                return (a.age - b.age) * direction;
            }

            return (
                a[sortBy].localeCompare(b[sortBy], undefined, {
                    sensitivity: "base",
                }) * direction
            );
        });
    }

    return {
        users: users.slice(skip, skip + limit),
        total: data.total,
        skip,
        limit,
    };
};


// Get a single users details
export const getUserById = async (
    userId: number,
): Promise<UserDetailsResponse> => {
    const { data } = await dummyJsonApi.get<User>(
        `/users/${userId}`,
    );

    const { password: _password, ...user } = data;

    return user;
};


// Delete a specific user
export const deleteUser = async (
    userId: number,
): Promise<DeleteUserResponse> => {
    const { data } =
        await dummyJsonApi.delete<DeleteUserResponse>(
            `/users/${userId}`,
        );

    return {
        id: data.id,
        isDeleted: data.isDeleted,
        deletedOn: data.deletedOn,
    };
};


// Create a new user
export const createUser = async (
    values: CreateUserInput,
): Promise<Omit<User, "password">> => {
    const { password, ...remainingValues } = values;
    const payload = password.trim()
        ? {
            ...remainingValues,
            password: await bcrypt.hash(password, 12),
        }
        : remainingValues;

    const { data } = await dummyJsonApi.post<User>(
        "/users/add",
        payload,
    );

    const { password: _password, ...user } = data;

    return user;
};


export const updateUser = async (
    userId: number,
    values: UpdateUserInput,
): Promise<Omit<User, "password">> => {
    const { password, ...remainingValues } = values;
    const payload = password.trim()
        ? {
            ...remainingValues,
            password: await bcrypt.hash(password, 12),
        }
        : remainingValues;

    const { data } = await dummyJsonApi.patch<User>(
        `/users/${userId}`,
        payload,
    );

    const { password: _password, ...user } = data;

    return user;
};
