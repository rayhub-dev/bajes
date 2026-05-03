import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createBudgetSchema } from "@bajes/schemas";
import { requireAuth } from "../../middleware/requireAuth.js";
import { AuthService } from "../../services/auth.js";
import { BudgetService } from "../../services/budget.js";
import { ok } from "../../lib/response.js";

const authService = new AuthService();
const budgetService = new BudgetService();

const idParamsSchema = z.object({
  id: z.string().cuid(),
});

const listQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

// eslint-disable-next-line @typescript-eslint/require-await -- Fastify requires async plugin functions
export async function budgetsV1Routes(server: FastifyInstance): Promise<void> {
  // ── GET /v1/budgets ───────────────────────────────────────────────────────
  server.get("/v1/budgets", { preHandler: requireAuth }, async (request) => {
    const { year, month } = server.validate.query(listQuerySchema, request.query);
    const user = await authService.getOrCreateUser(request.user.supabaseUid, request.user.email);

    const budgets = await budgetService.list(user.id, year, month);

    return ok(budgets, request.id);
  });

  // ── POST /v1/budgets ──────────────────────────────────────────────────────
  server.post("/v1/budgets", { preHandler: requireAuth }, async (request, reply) => {
    const body = server.validate.body(createBudgetSchema, request.body);
    const user = await authService.getOrCreateUser(request.user.supabaseUid, request.user.email);

    const budget = await budgetService.upsert(user.id, body);

    return reply.status(201).send(ok(budget, request.id));
  });

  // ── DELETE /v1/budgets/:id ────────────────────────────────────────────────
  server.delete("/v1/budgets/:id", { preHandler: requireAuth }, async (request) => {
    const { id } = server.validate.params(idParamsSchema, request.params);
    const user = await authService.getOrCreateUser(request.user.supabaseUid, request.user.email);

    await budgetService.delete(id, user.id);

    return ok({ deleted: true }, request.id);
  });
}
