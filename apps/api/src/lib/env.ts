import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid URL"),
  CORS_ORIGINS: z.string().min(1).default("http://localhost:3000,http://localhost:3001"),
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  SUPABASE_JWT_SECRET: z.string().min(1, "SUPABASE_JWT_SECRET is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const messages = parsedEnv.error.issues
    .map((issue) => {
      const key = issue.path.join(".") || "ENV";
      return `- ${key}: ${issue.message}`;
    })
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${messages}`);
}

export const env = {
  ...parsedEnv.data,
  corsOrigins: parsedEnv.data.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0),
} as const;

export type AppEnv = typeof env;
