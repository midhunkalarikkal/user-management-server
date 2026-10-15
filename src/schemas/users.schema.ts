import { z } from "zod";

const positiveInteger = (defaultValue: number) =>
  z.coerce.number().int().positive().default(defaultValue);

export const getUsersQuerySchema = z.object({
  page: positiveInteger(1),

  limit: positiveInteger(10).pipe(z.number().max(100, "Limit cannot exceed 100")),

  sortBy: z.enum(["firstName", "age", "email"]).optional(),

  order: z.enum(["asc", "desc"]).optional(),
});

export const filterUsersQuerySchema = getUsersQuerySchema.extend({
  key: z
    .string()
    .min(1, "Search field is required")
    .max(100)
    .regex(/^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)*$/, "Invalid search field")
    .refine(
      (key) =>
        !key.split(".").some((part) => ["__proto__", "prototype", "constructor"].includes(part)),
      "Invalid search field",
    ),

  value: z.string().trim().min(1, "Search value is required").max(200, "Search value is too long"),
});

const optionalText = (max: number) =>
  z.string().trim().max(max, `Must not exceed ${max} characters`);

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must not exceed ${max} characters`);

const optionalPattern = (max: number, pattern: RegExp, message: string) =>
  optionalText(max).refine((value) => value === "" || pattern.test(value), message);

const latitude = z.number().finite().min(-90).max(90);
const longitude = z.number().finite().min(-180).max(180);

const optionalPhone = optionalText(25).refine(
  (value) =>
    value === "" ||
    (/^\+?[\d\s().-]+$/.test(value) &&
      value.replace(/\D/g, "").length >= 7 &&
      value.replace(/\D/g, "").length <= 15),
  "Enter a valid phone number",
);

const optionalIp = optionalText(45).refine(
  (value) => value === "" || z.ipv4().safeParse(value).success || z.ipv6().safeParse(value).success,
  "Enter a valid IPv4 or IPv6 address",
);

const optionalMac = optionalPattern(
  17,
  /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/,
  "Enter a valid MAC address",
);

const optionalCardExpiry = optionalText(5).refine(
  (value) => value === "" || /^(0[1-9]|1[0-2])\/\d{2}$/.test(value),
  "Enter a valid expiry date in MM/YY format",
);

const addressSchema = z.object({
  address: optionalText(200),
  city: optionalText(100),
  state: optionalText(100),
  stateCode: optionalText(20),
  postalCode: optionalPattern(20, /^[\p{L}\p{N}\s-]+$/u, "Enter a valid postal code"),
  country: optionalText(100),
  coordinates: z.object({
    lat: latitude,
    lng: longitude,
  }),
});

const hairSchema = z.object({
  color: optionalText(50),
  type: optionalText(50),
});

const bankSchema = z.object({
  cardExpire: optionalCardExpiry,
  cardNumber: optionalPattern(19, /^\d{12,19}$/, "Card number must contain 12 to 19 digits"),
  cardType: optionalText(50),
  currency: optionalPattern(3, /^[A-Z]{3}$/, "Enter a valid 3-letter currency code"),
  iban: optionalPattern(34, /^[A-Za-z0-9]+$/, "IBAN must contain only letters and numbers"),
});

const companySchema = z.object({
  department: optionalText(100),
  name: optionalText(150),
  title: optionalText(100),
  address: addressSchema,
});

const cryptoSchema = z.object({
  coin: optionalText(50),
  wallet: optionalText(150),
  network: optionalText(100),
});

export const userFormSchema = z.object({
  firstName: requiredText("First name", 50),
  lastName: requiredText("Last name", 50),
  maidenName: optionalText(50),

  age: z
    .number()
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be 120 or less"),

  gender: z.enum(["male", "female", "other"]),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(254, "Email must not exceed 254 characters")
    .pipe(z.email("Enter a valid email address")),

  phone: optionalPhone,

  username: z
    .string()
    .trim()
    .min(3, "Username must contain at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Username can only contain letters, numbers, dots, underscores and hyphens",
    ),

  password: z
    .string()
    .min(6, "Password must contain at least 6 characters")
    .max(128, "Password must not exceed 128 characters"),

  birthDate: z
    .string()
    .refine((value) => value === "" || z.iso.date().safeParse(value).success, "Enter a valid date")
    .refine(
      (value) => value === "" || value <= new Date().toISOString().slice(0, 10),
      "Date of birth cannot be in the future",
    ),

  image: z
    .string()
    .trim()
    .min(1, "Profile image is required")
    .max(2048, "Image URL must not exceed 2048 characters")
    .pipe(z.httpUrl("Enter a valid HTTP or HTTPS image URL")),

  bloodGroup: optionalPattern(3, /^(A|B|AB|O)[+-]$/, "Enter a valid blood group"),

  height: z
    .number()
    .finite()
    .min(0, "Height cannot be negative")
    .max(300, "Height cannot exceed 300 cm"),

  weight: z
    .number()
    .finite()
    .min(0, "Weight cannot be negative")
    .max(500, "Weight cannot exceed 500 kg"),

  eyeColor: optionalText(50),
  hair: hairSchema,

  ip: optionalIp,
  address: addressSchema,
  macAddress: optionalMac,

  university: optionalText(200),

  bank: bankSchema,
  company: companySchema,

  ein: optionalText(30),
  ssn: optionalText(30),
  userAgent: optionalText(1024),

  crypto: cryptoSchema,

  role: z.enum(["admin", "moderator", "user"]),
});

export const createUserSchema = userFormSchema;

export const updateUserSchema = userFormSchema.omit({ password: true }).extend({
  password: z
    .string()
    .max(128, "Password must not exceed 128 characters")
    .refine(
      (value) => value === "" || value.length >= 6,
      "Password must contain at least 6 characters",
    )
    .optional(),
});

export type GetUsersParams = z.infer<typeof getUsersQuerySchema>;

export type FilterUsersParams = z.infer<typeof filterUsersQuerySchema>;

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
