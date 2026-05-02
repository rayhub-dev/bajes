## 2026-05-01T08:56:00+07:00 Task: bootstrap

- Existing backend only has inline routes in `apps/api/src/server.ts` and Prisma singleton in `apps/api/src/lib/prisma.ts`.
- Frontend has route groups `(auth)` and `(app)` already present; many TODO checkboxes in `TODO.md` are stale relative to implementation.
- Supabase web auth integration already exists (`apps/web/src/lib/supabase/client.ts`, Google login wiring).

## 2026-05-01T09:22:00+07:00 Task: T1 env+response foundation

- Added centralized env parsing in `apps/api/src/lib/env.ts` using zod with fail-fast validation and defaults for `NODE_ENV`, `HOST`, `PORT`, and `CORS_ORIGINS`.
- Added reusable response helpers in `apps/api/src/lib/response.ts` (`ok`, `fail`, `paginated`) aligned with `@bajes/types` contracts (`ApiSuccessResponse`, `ApiErrorResponse`, `PaginatedResponse`).

## 2026-05-01T09:05:06+07:00 Task: T2 error+validation plugins

- Added `apps/api/src/plugins/errorHandler.ts` with centralized Fastify error mapping for Zod errors, Fastify/http status errors, and unknown errors, all normalized through `fail(...)` response envelope.
- Added `apps/api/src/plugins/validate.ts` to expose strict typed `server.validate.body/query/params` helpers using zod `.parse(...)` for route-level request parsing.
- Registered both plugins in `apps/api/src/server.ts` after core infra plugins so they are available for upcoming route/service wiring in T3.

## 2026-05-01T09:11:54+07:00 Task: T3 category vertical slice

- Implemented route -> service -> repository layering for `GET /v1/categories` so route formatting stays in `routes/v1/categories.ts` and Prisma access is isolated in `repositories/category.ts`.
- Used `server.validate.query(...)` with a strict zod query schema (`userId`, `includeDefaults`) to keep request parsing deterministic and typed before service invocation.
- Kept category output aligned to `CategoryDTO` and standardized envelope via `ok(...)` for consistent API contract.

## 2026-05-01T09:24:59+07:00 Task: T3 runtime fix

- Root cause was plugin encapsulation: `validatePlugin` decorated the root Fastify instance, but `categoriesV1Routes` runs inside a child plugin scope where that decorator was not guaranteed; runtime then hit `undefined.query`.
- Minimal fix: call `validatePlugin(server)` and `errorHandlerPlugin(server)` directly on the root instance in bootstrap so decorators/handlers are present for all routes without changing route/service/repository layering.
- Runtime smoke on built server confirmed `GET /v1/categories` now returns the standardized `ok(...)` envelope successfully.

## 2026-05-01T09:30:03+07:00 Task: T4 web dependency baseline

- Installed `axios`, `dexie`, `zustand`, and `@tanstack/react-query` directly in `@bajes/web` dependencies via filtered pnpm workspace command.
- Existing Next.js/React 14.2/18 stack remained unchanged; `pnpm --filter @bajes/web type-check` passed immediately after installation.

## 2026-05-01T09:35:42+07:00 Task: T5 shared API client scaffold

- Added shared Axios client in `apps/web/src/lib/api/client.ts` with `withCredentials: true` and env-driven base URL using strict bracket env access.
- `getApiBaseUrl()` now provides safe local fallback (`http://localhost:4000`) when `NEXT_PUBLIC_API_URL` is unset or blank to keep local development resilient.
- Added barrel export in `apps/web/src/lib/api/index.ts` so future API modules can reuse a single client entry point.

## 2026-05-01T09:41:14+07:00 Task: T6 local Dexie schema

- Added `apps/web/src/lib/db/index.ts` with a Dexie singleton and typed `transactions`/`budgets` tables for offline-first local persistence.
- Reused shared type unions from `@bajes/types` (`TransactionType`, `PeriodType`, `SyncStatus`) so local entities stay aligned with backend/shared contracts.
- Indexed both tables for sync-heavy queries using `userId`, `updatedAt`, and `syncStatus`, including compound indexes to support filtered sync scans.

## 2026-05-01T10:02:00+07:00 Task: T7 zustand base stores

- Added `apps/web/src/store/auth.ts` with strictly typed auth state (`UserDTO`/`SessionDTO`) and minimal mutators (`setUser`, `setSession`, `setAuth`, `setIsInitializing`, `resetAuth`) for future integration.
- Added `apps/web/src/store/ui.ts` with core app-wide UI flags (`isOnline`, `isSyncing`, `isGlobalLoading`, `activeModal`) and focused actions to update/reset state without feature-specific behavior.
- Added `apps/web/src/store/index.ts` barrel exports to keep store imports consistent for upcoming provider/hook wiring tasks.

## 2026-05-01T09:50:15+07:00 Task: T8 react-query provider wiring

- Added `apps/web/src/components/providers/QueryProvider.tsx` as a client component using lazy `useState(() => new QueryClient(...))` so the query client is created once per app mount and not recreated on rerenders.
- Set baseline query defaults (`retry: 1`, `staleTime: 30_000`, `refetchOnWindowFocus: false`, `refetchOnReconnect: true`) to keep network behavior predictable for mobile-first usage without aggressive refetch churn.
- Wired `QueryProvider` in `apps/web/src/app/layout.tsx` above existing `ThemeProvider` so current theme wrapper semantics and styling remain intact while enabling global React Query usage.

## 2026-05-01T10:15:00+07:00 Task: T9 TODO.md progress update

- Mapped T1-T8 deliverables to TODO.md sections 1.5 and 1.6 checklist items; all 7 remaining items now marked ✅ with `(2026-05-01)` date suffix.
- Section 1.5 completions: repository pattern (T3), global error handler (T2).
- Section 1.6 completions: App Router structure (pre-existing, confirmed), Axios base config (T5), IndexedDB/Dexie schema (T6), Zustand base stores (T7), React Query provider (T8).
- Both sections 1.5 and 1.6 are now fully ✅ — no remaining ⬜ items in either section.

## 2026-05-01T15:28:26+07:00 Task: auth login/provisioning fix

- Root cause was split across frontend and backend dev path assumptions: backend CORS only trusted `localhost:3000` by default, while dev frequently runs web on `localhost:3001`, causing `/v1/auth/me` to fail before provisioning could execute.
- Added explicit dev-safe CORS allowance for both `http://localhost:3000` and `http://localhost:3001` in `apps/api/src/server.ts`, while still respecting configured `CORS_ORIGINS` entries.
- Added a dedicated `bajes-authenticated` cookie bridge in `AuthProvider` and login submit flow so Next middleware can correctly treat signed-in users as authenticated during SSR navigation.
- `GET /v1/auth/me` remains the provisioning entrypoint (`authService.getOrCreateUser(...)`) and is now reachable in both 3000/3001 dev scenarios.

## 2026-05-01T15:34:29+07:00 Task: middleware login loop fix

- Updated `apps/web/src/middleware.ts` auth decision to treat `bajes-authenticated=true` as a first-class authenticated signal in addition to Supabase `*-auth-token` cookies.
- Kept existing public-path and matcher behavior unchanged; only tightened the redirect condition to avoid false redirects for already-authenticated users.
- Runtime smoke verified route decisions on `/dashboard`: no cookie redirects to login, while `bajes-authenticated=true` and `bajes-guest-mode=true` both allow access.
