import type { FastifyInstance } from "fastify";
import { z } from "zod";

type ValidateHelpers = {
  body<TSchema extends z.ZodTypeAny>(schema: TSchema, data: unknown): z.infer<TSchema>;
  query<TSchema extends z.ZodTypeAny>(schema: TSchema, data: unknown): z.infer<TSchema>;
  params<TSchema extends z.ZodTypeAny>(schema: TSchema, data: unknown): z.infer<TSchema>;
};

declare module "fastify" {
  interface FastifyInstance {
    validate: ValidateHelpers;
  }
}

function parseWithSchema<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown,
): z.infer<TSchema> {
  return schema.parse(data);
}

export async function validatePlugin(server: FastifyInstance): Promise<void> {
  const validate: ValidateHelpers = {
    body: parseWithSchema,
    query: parseWithSchema,
    params: parseWithSchema,
  };

  server.decorate("validate", validate);
}
