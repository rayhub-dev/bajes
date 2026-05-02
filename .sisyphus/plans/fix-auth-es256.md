# Fix: requireAuth ES256 JWT Verification

## Root Cause

Supabase project `nfwpnxokgwbzbfoctoga` uses **ES256 (ECDSA P-256)** for JWT signing.
The `requireAuth.ts` middleware uses `jsonwebtoken` with `algorithms: ["HS256"]` which CANNOT verify ES256 tokens.
Result: ALL authenticated API requests return 401.

## Evidence

- Token header: `{"alg":"ES256","kid":"7921308c-5475-4d6e-bcd5-5612418d6d6d"}`
- JWKS endpoint confirms: `https://nfwpnxokgwbzbfoctoga.supabase.co/auth/v1/.well-known/jwks.json`
- Server logs show 401 on valid token with no error details (caught in try/catch)

## Fix: Replace entire `apps/api/src/middleware/requireAuth.ts`

```typescript
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
```

## Verification

1. `pnpm --filter @bajes/api type-check` must pass
2. `pnpm --filter @bajes/api build` must pass
3. Start server: `node --env-file=.env dist/server.js`
4. Test with real token: `GET /v1/auth/me` with `Authorization: Bearer <token>` → should return 200 with user data

## Also remove unused `jsonwebtoken` dependency (optional cleanup)

- Can remove `jsonwebtoken` and `@types/jsonwebtoken` from `apps/api/package.json` if no other file uses them
- Check: `grep -r "jsonwebtoken" apps/api/src/` should return 0 results after the fix
