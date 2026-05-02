## TODOs

- [x] T1: Backend env config and response helpers (`apps/api/src/lib/env.ts`, `apps/api/src/lib/response.ts`) and fix `apps/api/.env` `DATABASE_URL` typo.
- [x] T2: Backend global error handler and zod validation plugin (`apps/api/src/plugins/errorHandler.ts`, `apps/api/src/plugins/validate.ts`) registered in `apps/api/src/server.ts`.
- [x] T3: Repository pattern vertical slice for categories (`apps/api/src/repositories/base.ts`, `apps/api/src/repositories/category.ts`, `apps/api/src/services/category.ts`, `apps/api/src/routes/v1/categories.ts`) wired in `apps/api/src/server.ts`.
- [x] T4: Frontend dependencies installed in `@bajes/web` (`axios`, `dexie`, `zustand`, `@tanstack/react-query`).
- [x] T5: Frontend Axios base client (`apps/web/src/lib/api/client.ts`, `apps/web/src/lib/api/index.ts`) and `apps/web/.env.example` updated with `NEXT_PUBLIC_API_URL`.
- [x] T6: Frontend Dexie schema (`apps/web/src/lib/db/index.ts`) with `LocalTransaction`, `LocalBudget`, and `syncStatus` support.
- [x] T7: Frontend Zustand base stores (`apps/web/src/store/auth.ts`, `apps/web/src/store/ui.ts`, `apps/web/src/store/index.ts`).
- [x] T8: Frontend React Query provider (`apps/web/src/components/providers/QueryProvider.tsx`) wired in `apps/web/src/app/layout.tsx`.
- [x] T9: Update `TODO.md` section 1.5 and 1.6 checkboxes to completed for delivered items.

## Final Verification Wave

- [x] F1: LSP diagnostics clean on all changed TS/TSX files.
- [x] F2: `pnpm --filter @bajes/api type-check` and API-targeted checks pass.
- [x] F3: `pnpm --filter @bajes/web type-check` and `pnpm --filter @bajes/web build` pass.
- [x] F4: Runtime smoke checks pass (`GET /health`, `GET /v1/categories`) and frontend boots without console/runtime errors.
