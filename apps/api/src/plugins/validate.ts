import type { FastifyInstance } from "fastify";
import type { z } from "zod";

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Zod parse returns inferred type
  return schema.parse(data);
}

export function validatePlugin(server: FastifyInstance): void {
  const validate: ValidateHelpers = {
    body: parseWithSchema,
    query: parseWithSchema,
    params: parseWithSchema,
  };

  server.decorate("validate", validate);
}
