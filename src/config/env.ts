
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),

    PORT: z.coerce.number().int().min(1).max(65535).default(5000),

    CLIENT_URL: z.url(),

    DEMO_EMAIL: z.email(),

    DEMO_PASSWORD_HASH: z
        .string()
        .regex(/^\$2[aby]\$\d{2}\$.{53}$/, "Invalid bcrypt hash"),

    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),

    COOKIE_SAME_SITE: z
        .enum(["lax", "strict", "none"])
        .default("lax"),

    DUMMYJSON_BASE_URL: z.url()
});

export const env = envSchema.parse(process.env);
