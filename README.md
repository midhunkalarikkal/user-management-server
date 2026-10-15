# User Management Server

A RESTful backend API for a full-stack User Management application, built with **Node.js, Express 5, and TypeScript**.

The server integrates with [DummyJSON](https://dummyjson.com/) to provide sample user data and supports user authentication, CRUD operations, request validation, and centralized error handling.

## API Endpoints

### Authentication

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| POST   | `/api/auth/login`   | Authenticate a user             |
| POST   | `/api/auth/refresh` | Refresh authentication tokens   |
| POST   | `/api/auth/logout`  | Log out                         |
| GET    | `/api/auth/me`      | Retrieve the authenticated user |

### User Management

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/api/users`         | Retrieve paginated users |
| GET    | `/api/users/filter`  | Filter and search users  |
| GET    | `/api/users/:userId` | Retrieve user details    |
| POST   | `/api/users/`        | Create a user            |
| PATCH  | `/api/users/:userId` | Update user details      |
| DELETE | `/api/users/:userId` | Delete a user            |

## Data Source

User data is provided by [DummyJSON](https://dummyjson.com/), a free mock REST API.

Create, update, and delete operations are simulated by DummyJSON and are not permanently persisted.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
