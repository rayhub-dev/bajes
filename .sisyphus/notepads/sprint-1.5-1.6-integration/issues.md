## 2026-05-01T08:56:00+07:00 Task: bootstrap

- `apps/api/.env` currently has malformed `DATABASE_URL` prefix (`ppostgresql://`) and may break Prisma runtime commands.
- Local shell may resolve to bun-node shim in some flows; when command behavior differs, explicitly use project scripts and verify outputs.

## 2026-05-01T09:22:00+07:00 Task: T1 env+response foundation

- Corrected `apps/api/.env` `DATABASE_URL` scheme from `ppostgresql://` to `postgresql://`.
- No implementation blockers encountered; type-check passed after introducing `env.ts` and `response.ts`.

## 2026-05-01T09:05:06+07:00 Task: T2 error+validation plugins

- No blockers encountered during plugin integration; `pnpm --filter @bajes/api type-check` passed after registering `validatePlugin` and `errorHandlerPlugin` in server bootstrap.

## 2026-05-01T09:11:54+07:00 Task: T3 category vertical slice

- Initial type-check failed because `BaseRepository` has a protected constructor; fixed by adding an explicit `CategoryRepository` constructor that calls `super(db)`.
- No remaining blockers after fix; `pnpm --filter @bajes/api type-check` passed.

## 2026-05-01T09:24:59+07:00 Task: T3 runtime fix

- `pnpm --filter @bajes/api dev` is not reliable in this shell due to tsx preload error; used `pnpm --filter @bajes/api build` + `node apps/api/dist/server.js` for runtime smoke instead.
- Encountered stale process on port `4000` during one smoke attempt; terminated it before rerunning verification.

## 2026-05-01T09:30:03+07:00 Task: T4 web dependency baseline

- No blockers during dependency install; pnpm completed with non-blocking warnings about deprecated transitive packages.
- `pnpm --filter @bajes/web type-check` passed after install, confirming the new dependencies did not introduce TypeScript conflicts.

## 2026-05-01T09:35:42+07:00 Task: T5 shared API client scaffold

- `lsp_diagnostics` cannot run on `.env.example` because no LSP server is configured for `.example`; TypeScript files were validated with zero diagnostics and full package type-check passed.
- No implementation blockers encountered for T5 scope.

## 2026-05-01T09:41:14+07:00 Task: T6 local Dexie schema

- No implementation blockers encountered; Dexie schema was added in a single file with strict types and no `any`.
- Verification pending in this step: `pnpm --filter @bajes/web type-check`.

## 2026-05-01T10:02:00+07:00 Task: T7 zustand base stores

- No implementation blockers encountered while adding the three store files; existing shared DTO types in `@bajes/types` were sufficient for auth typing.
- Kept baseline-only scope (no middleware/persistence/component wiring) to avoid introducing feature behavior before T8+ integration.

## 2026-05-01T09:50:15+07:00 Task: T8 react-query provider wiring

- No implementation blockers for provider wiring; `lsp_diagnostics` returned zero issues for `apps/web/src/components/providers/QueryProvider.tsx` and `apps/web/src/app/layout.tsx`.
- `pnpm --filter @bajes/web type-check` and `pnpm --filter @bajes/web build` both passed; Next.js emitted non-fatal webpack cache warnings related to resolving `apps/web/node-fetch`, but build exited successfully.

## 2026-05-01T10:15:00+07:00 Task: T9 TODO.md progress update

- No blockers encountered; all edits were straightforward checkbox status changes with date suffixes.
- The App Router folder structure item (`(auth)/`, `(app)/`) was already present in the codebase before this sprint (noted in bootstrap learnings) but was never marked complete in TODO.md — now corrected.

## 2026-05-01T15:28:26+07:00 Task: auth login/provisioning fix

- Initial API runtime smoke with repo `.env` failed because `JWT_SECRET` was missing, so server exited before endpoint checks; used explicit non-sensitive local env injection in smoke command to validate HTTP behavior without mutating env files.
- Earlier attempt to start API via PowerShell `Start-Process` path failed under this shell; switched to `Start-Job` + `node apps/api/dist/server.js` for stable start/stop runtime verification.

## 2026-05-01T15:34:29+07:00 Task: middleware login loop fix

- First attempt to run `next dev` via `pnpm --filter @bajes/web dev -- --hostname ... --port ...` failed because argument forwarding was interpreted as an invalid project directory (`apps/web/--hostname`); switched to `pnpm --filter @bajes/web exec next dev --hostname 127.0.0.1 --port 3001` for runtime check.
- Runtime smoke emitted a non-fatal webpack cache warning about missing `apps/web/node-fetch`; middleware behavior checks still completed successfully.
