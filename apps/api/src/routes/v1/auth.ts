import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middleware/requireAuth.js";
import { AuthService } from "../../services/auth.js";
import { ok } from "../../lib/response.js";

const authService = new AuthService();

// eslint-disable-next-line @typescript-eslint/require-await -- Fastify requires async plugin functions
export async function authV1Routes(server: FastifyInstance): Promise<void> {
  server.get("/v1/auth/me", { preHandler: requireAuth }, async (request) => {
    const { supabaseUid, email } = request.user;
    const user = await authService.getOrCreateUser(supabaseUid, email);
    return ok(user, request.id);
  });

  server.post("/v1/auth/logout", { preHandler: requireAuth }, (request) => {
    return ok({ message: "Logged out" }, request.id);
  });
}
