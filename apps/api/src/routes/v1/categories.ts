import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/requireAuth.js";
import { AuthService } from "../../services/auth.js";
import { CategoryService } from "../../services/category.js";
import { ok } from "../../lib/response.js";

const authService = new AuthService();
const categoryService = new CategoryService();

const listCategoriesQuerySchema = z.object({
  includeDefaults: z
    .enum(["true", "false"])
    .default("true")
    .transform((val) => val === "true"),
});

// eslint-disable-next-line @typescript-eslint/require-await -- Fastify requires async plugin functions
export async function categoriesV1Routes(server: FastifyInstance): Promise<void> {
  server.get("/v1/categories", { preHandler: requireAuth }, async (request) => {
    const query = server.validate.query(listCategoriesQuerySchema, request.query);
    const user = await authService.getOrCreateUser(request.user.supabaseUid, request.user.email);
    const categories = await categoryService.getCategories({
      userId: user.id,
      includeDefaults: query.includeDefaults,
    });
    return ok(categories, request.id);
  });
}
