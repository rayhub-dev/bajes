import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionFiltersSchema,
} from "@bajes/schemas";
import { requireAuth } from "../../middleware/requireAuth.js";
import { AuthService } from "../../services/auth.js";
import { TransactionService } from "../../services/transaction.js";
import { ok, paginated } from "../../lib/response.js";

const authService = new AuthService();
const transactionService = new TransactionService();

const idParamsSchema = z.object({
  id: z.string().cuid(),
});

const batchCreateSchema = z.array(createTransactionSchema).max(50);

export function transactionsV1Routes(server: FastifyInstance): void {
  // ── GET /v1/transactions ─────────────────────────────────────────────────
  server.get("/v1/transactions", { preHandler: requireAuth }, async (request) => {
    const filters = server.validate.query(transactionFiltersSchema, request.query);
    const user = await authService.getOrCreateUser(request.user.supabaseUid, request.user.email);

    const result = await transactionService.list(user.id, filters);

    return paginated(result.data, result.pagination, request.id);
  });

  // ── POST /v1/transactions ────────────────────────────────────────────────
  server.post("/v1/transactions", { preHandler: requireAuth }, async (request, reply) => {
    const body = server.validate.body(createTransactionSchema, request.body);
    const user = await authService.getOrCreateUser(request.user.supabaseUid, request.user.email);

    const transaction = await transactionService.create(user.id, body);

    return reply.status(201).send(ok(transaction, request.id));
  });

  // ── PUT /v1/transactions/:id ─────────────────────────────────────────────
  server.put("/v1/transactions/:id", { preHandler: requireAuth }, async (request) => {
    const { id } = server.validate.params(idParamsSchema, request.params);
    const body = server.validate.body(updateTransactionSchema, request.body);
    const user = await authService.getOrCreateUser(request.user.supabaseUid, request.user.email);

    const transaction = await transactionService.update(id, user.id, body);

    return ok(transaction, request.id);
  });

  // ── DELETE /v1/transactions/:id ──────────────────────────────────────────
  server.delete("/v1/transactions/:id", { preHandler: requireAuth }, async (request) => {
    const { id } = server.validate.params(idParamsSchema, request.params);
    const user = await authService.getOrCreateUser(request.user.supabaseUid, request.user.email);

    await transactionService.delete(id, user.id);

    return ok({ deleted: true }, request.id);
  });

  // ── POST /v1/transactions/batch ──────────────────────────────────────────
  server.post("/v1/transactions/batch", { preHandler: requireAuth }, async (request) => {
    const body = server.validate.body(batchCreateSchema, request.body);
    const user = await authService.getOrCreateUser(request.user.supabaseUid, request.user.email);

    const transactions = await transactionService.batchSync(user.id, body);

    return ok(transactions, request.id);
  });
}
