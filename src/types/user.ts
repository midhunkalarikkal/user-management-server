// User location coordinates
export interface Coordinates {
  lat: number;
  lng: number;
}

// User address details
export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

// User hair details
export interface Hair {
  color: string;
  type: string;
}

// User bank details
export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

// User company details
export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

// User crypto details
export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

// Available user roles
export type UserRole = "admin" | "moderator" | "user";

// Available gender options
export type UserGender = "male" | "female" | "other";

// User data from DummyJSON API
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: UserGender;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: UserRole;
}

// Users API response with pagination
export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

// Get user details
export type UserDetailsResponse = Omit<User, "password">;

// Data for creating a user
export type CreateUserInput = Partial<Omit<User, "id">>;

// Data for updating a user
export type UpdateUserInput = Partial<Omit<User, "id">>;

// Fields available for sorting users
export type UserSortField = "firstName" | "age" | "email";

// Sorting order
export type SortOrder = "asc" | "desc";

// Users sorting options
export interface UsersSort {
  sortBy?: UserSortField;
  order?: SortOrder;
}

// Users table data
export type UsersTableColumn = Pick<
  User,
  "id" | "firstName" | "lastName" | "age" | "email" | "role" | "image"
>;

// Paginated API response
export interface ApiPaginatedResponse<TData> {
  users: TData[];
  total: number;
  skip: number;
  limit: number;
}

// Users query params
export interface GetUsersQueryParams {
  page: number;
  limit: number;
  sortBy?: "firstName" | "age" | "email";
  order?: "asc" | "desc";
}

// Users filter params
export interface FilterUsersQueryParams
  extends GetUsersQueryParams {
  key: string;
  value: string;
}

// Delete user response
export interface DeleteUserResponse {
  id: number;
  isDeleted: boolean;
  deletedOn: string;
}