import type { FastifyReply, FastifyRequest } from "fastify";
import { getSupabaseAdmin } from "../lib/supabase.js";
import { fail } from "../lib/response.js";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      supabaseUid: string;
      email: string;
    };
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    void reply
      .status(401)
      .send(fail("AUTH_001", "Missing or invalid authorization header", String(request.id)));
    return;
  }

  const token = authHeader.slice(7);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    void reply.status(401).send(fail("AUTH_001", "Invalid or expired token", String(request.id)));
    return;
  }

  request.user = {
    supabaseUid: data.user.id,
    email: data.user.email ?? "",
  };
}
