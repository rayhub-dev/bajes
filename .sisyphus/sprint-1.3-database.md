# Sprint 1.3 — Database Setup

**Status:** Ready for implementation
**Priority:** P0
**Depends on:** 1.1 (Monorepo) ✅, 1.2 (Tooling) ✅

---

## Objective

Set up the complete Prisma + PostgreSQL database layer for the Bajes API. This includes the schema with all 7 models, seed data for default categories, Row Level Security SQL, and a Prisma client singleton.

---

## Tasks

### 1. Create Prisma Schema (`apps/api/prisma/schema.prisma`)

Create the file with the exact schema from PRD-01 Section 5.1. Key details:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**Models to create (7 total):**

1. **User** — `@@map("users")`
   - `id` String @id @default(cuid())
   - `firebaseUid` String @unique @map("firebase_uid")
   - `email` String @unique
   - `displayName` String? @map("display_name")
   - `photoUrl` String? @map("photo_url")
   - `currencyCode` String @default("IDR") @map("currency_code")
   - `isGuest` Boolean @default(false) @map("is_guest")
   - `createdAt` DateTime @default(now()) @map("created_at")
   - `updatedAt` DateTime @updatedAt @map("updated_at")
   - `deletedAt` DateTime? @map("deleted_at")
   - Relations: transactions, budgets, categories, sessions, pushSubs, auditLogs

2. **Session** — `@@map("sessions")`
   - `id` String @id @default(cuid())
   - `userId` String @map("user_id")
   - `refreshToken` String @unique @map("refresh_token")
   - `userAgent` String? @map("user_agent")
   - `ipAddress` String? @map("ip_address")
   - `expiresAt` DateTime @map("expires_at")
   - `revokedAt` DateTime? @map("revoked_at")
   - `createdAt` DateTime @default(now()) @map("created_at")
   - Relation: user (Cascade)
   - Indexes: [userId], [refreshToken]

3. **Category** — `@@map("categories")`
   - `id` String @id @default(cuid())
   - `userId` String? @map("user_id") (null = system default)
   - `name` String
   - `icon` String
   - `color` String
   - `type` CategoryType enum
   - `isDefault` Boolean @default(false) @map("is_default")
   - `sortOrder` Int @default(0) @map("sort_order")
   - `createdAt` DateTime @default(now()) @map("created_at")
   - `updatedAt` DateTime @updatedAt @map("updated_at")
   - Relation: user? (Cascade), transactions, budgets
   - Index: [userId]

4. **Transaction** — `@@map("transactions")`
   - `id` String @id @default(cuid())
   - `userId` String @map("user_id")
   - `categoryId` String @map("category_id")
   - `amountEncrypted` String @map("amount_encrypted")
   - `amountCents` Int @map("amount_cents")
   - `type` TransactionType enum
   - `note` String?
   - `transactionDate` DateTime @map("transaction_date")
   - `clientId` String? @unique @map("client_id")
   - `syncedAt` DateTime? @map("synced_at")
   - `createdAt` DateTime @default(now()) @map("created_at")
   - `updatedAt` DateTime @updatedAt @map("updated_at")
   - `deletedAt` DateTime? @map("deleted_at")
   - Relations: user (Cascade), category
   - Indexes: [userId, transactionDate(sort: Desc)], [userId, deletedAt], [clientId]

5. **Budget** — `@@map("budgets")`
   - `id` String @id @default(cuid())
   - `userId` String @map("user_id")
   - `categoryId` String @map("category_id")
   - `amountCents` Int @map("amount_cents")
   - `periodType` PeriodType @map("period_type")
   - `periodYear` Int @map("period_year")
   - `periodMonth` Int? @map("period_month")
   - `periodWeek` Int? @map("period_week")
   - `notifyAt` Int @default(80) @map("notify_at")
   - `notifiedAt` DateTime? @map("notified_at")
   - `createdAt` DateTime @default(now()) @map("created_at")
   - `updatedAt` DateTime @updatedAt @map("updated_at")
   - Relations: user (Cascade), category
   - Unique: [userId, categoryId, periodType, periodYear, periodMonth, periodWeek]
   - Index: [userId, periodYear, periodMonth]

6. **PushSubscription** — `@@map("push_subscriptions")`
   - `id` String @id @default(cuid())
   - `userId` String @map("user_id")
   - `endpoint` String @unique
   - `p256dh` String @map("p256dh")
   - `auth` String
   - `userAgent` String? @map("user_agent")
   - `createdAt` DateTime @default(now()) @map("created_at")
   - `lastUsedAt` DateTime? @map("last_used_at")
   - Relation: user (Cascade)
   - Index: [userId]

7. **AuditLog** — `@@map("audit_logs")`
   - `id` String @id @default(cuid())
   - `userId` String @map("user_id")
   - `action` String
   - `resourceId` String? @map("resource_id")
   - `ipAddress` String? @map("ip_address")
   - `userAgent` String? @map("user_agent")
   - `metadata` Json?
   - `createdAt` DateTime @default(now()) @map("created_at")
   - Relation: user (Cascade)
   - Indexes: [userId, createdAt(sort: Desc)], [action]

**Enums (3):**

- `CategoryType` { INCOME, EXPENSE }
- `TransactionType` { INCOME, EXPENSE }
- `PeriodType` { MONTHLY, WEEKLY }

---

### 2. Create Seed File (`apps/api/prisma/seed.ts`)

TypeScript file using `@prisma/client` to seed 7 default categories:

```typescript
import { PrismaClient, CategoryType } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  // Expense (5)
  {
    name: "Makanan & Minuman",
    icon: "🍜",
    color: "#FF6B6B",
    type: CategoryType.EXPENSE,
    isDefault: true,
    sortOrder: 1,
  },
  {
    name: "Transportasi",
    icon: "🚗",
    color: "#4ECDC4",
    type: CategoryType.EXPENSE,
    isDefault: true,
    sortOrder: 2,
  },
  {
    name: "Belanja",
    icon: "🛍️",
    color: "#45B7D1",
    type: CategoryType.EXPENSE,
    isDefault: true,
    sortOrder: 3,
  },
  {
    name: "Tagihan",
    icon: "📱",
    color: "#96CEB4",
    type: CategoryType.EXPENSE,
    isDefault: true,
    sortOrder: 4,
  },
  {
    name: "Hiburan",
    icon: "🎮",
    color: "#FFEAA7",
    type: CategoryType.EXPENSE,
    isDefault: true,
    sortOrder: 5,
  },
  // Income (2)
  {
    name: "Gaji",
    icon: "💼",
    color: "#6BCB77",
    type: CategoryType.INCOME,
    isDefault: true,
    sortOrder: 1,
  },
  {
    name: "Freelance",
    icon: "💻",
    color: "#4D96FF",
    type: CategoryType.INCOME,
    isDefault: true,
    sortOrder: 2,
  },
];

async function main(): Promise<void> {
  console.log("🌱 Seeding default categories...");

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        // Use a composite approach: find by name + isDefault
        id: "seed-placeholder", // Will not match, forces create
      },
      update: {},
      create: {
        ...category,
        userId: null, // System-level defaults
      },
    });
  }

  // Better approach: use createMany with skipDuplicates
  await prisma.category.createMany({
    data: defaultCategories.map((cat) => ({
      ...cat,
      userId: null,
    })),
    skipDuplicates: true,
  });

  const count = await prisma.category.count({ where: { isDefault: true } });
  console.log(`✅ Seeded ${count} default categories`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Important:** The seed should be idempotent (safe to run multiple times). Use `createMany` with `skipDuplicates: true`. Add a unique constraint consideration — since categories don't have a natural unique key for defaults, use a check-then-create pattern:

```typescript
// Better idempotent approach:
async function main(): Promise<void> {
  console.log("🌱 Seeding default categories...");

  const existingCount = await prisma.category.count({ where: { isDefault: true, userId: null } });

  if (existingCount >= defaultCategories.length) {
    console.log("✅ Default categories already seeded, skipping.");
    return;
  }

  await prisma.category.createMany({
    data: defaultCategories.map((cat) => ({ ...cat, userId: null })),
    skipDuplicates: true,
  });

  const count = await prisma.category.count({ where: { isDefault: true } });
  console.log(`✅ Seeded ${count} default categories`);
}
```

---

### 3. Create RLS Migration (`apps/api/prisma/migrations/00000000000001_enable_rls/migration.sql`)

A manual SQL migration to enable Row Level Security on all tables:

```sql
-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own data
-- Note: Prisma uses service_role key which bypasses RLS.
-- These policies are defense-in-depth for direct Supabase access.

CREATE POLICY "users_own_data" ON users
  FOR ALL USING (id = auth.uid()::text);

CREATE POLICY "sessions_own_data" ON sessions
  FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "transactions_own_data" ON transactions
  FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "budgets_own_data" ON budgets
  FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "categories_own_or_default" ON categories
  FOR ALL USING (user_id = auth.uid()::text OR user_id IS NULL);

CREATE POLICY "push_subscriptions_own_data" ON push_subscriptions
  FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "audit_logs_own_data" ON audit_logs
  FOR ALL USING (user_id = auth.uid()::text);
```

**Note:** This migration should be applied AFTER the initial Prisma migration creates the tables. It can also be stored as a standalone SQL file at `apps/api/prisma/rls.sql` for manual execution via Supabase dashboard if preferred.

---

### 4. Create Prisma Client Singleton (`apps/api/src/lib/prisma.ts`)

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env["NODE_ENV"] === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Create the `src/lib/` directory if it doesn't exist.

---

### 5. Add `prisma` seed config to `package.json`

In `apps/api/package.json`, add the `prisma` key:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

### 6. Update `tsconfig.json`

The current tsconfig excludes `prisma/`. The seed file uses `tsx` directly so it doesn't need to be in the TS compilation. However, ensure the `src/lib/prisma.ts` file is included (it already is via `src/**/*.ts`). No changes needed.

---

## Verification Steps

1. `npx prisma validate` — Schema syntax is correct
2. `npx prisma generate` — Client generates without errors
3. `pnpm type-check` in `apps/api` — No TypeScript errors
4. (When DB connected) `npx prisma migrate dev --name init` — Creates tables
5. (When DB connected) `pnpm db:seed` — Seeds 7 default categories
6. (When DB connected) Verify seed: `SELECT * FROM categories WHERE is_default = true` returns 7 rows

---

## Files to Create/Modify

| Action | Path                                              |
| ------ | ------------------------------------------------- |
| CREATE | `apps/api/prisma/schema.prisma`                   |
| CREATE | `apps/api/prisma/seed.ts`                         |
| CREATE | `apps/api/prisma/rls.sql`                         |
| CREATE | `apps/api/src/lib/prisma.ts`                      |
| MODIFY | `apps/api/package.json` (add `prisma.seed` field) |

---

## Acceptance Criteria

- [ ] `prisma/schema.prisma` contains all 7 models with correct fields, relations, indexes, and maps
- [ ] `prisma/seed.ts` seeds 5 expense + 2 income default categories idempotently
- [ ] `prisma/rls.sql` enables RLS on all 7 tables with user-scoped policies
- [ ] `src/lib/prisma.ts` exports a singleton PrismaClient
- [ ] `package.json` has `prisma.seed` configured
- [ ] `npx prisma validate` passes
- [ ] `npx prisma generate` succeeds
- [ ] `pnpm type-check` passes in apps/api
