# Fix: Auth Schema (firebase→supabase) + Login Stuck

## Problem 1: User table has `firebase_uid` column — should be `supabase_uid` with `auth_provider`

## Problem 2: Login button stuck on "Loading..." — not redirecting to dashboard

---

## TASK A: Prisma Schema Migration

### Step 1: Update `apps/api/prisma/schema.prisma`

Change the User model from:

```prisma
model User {
  id           String    @id @default(cuid())
  firebaseUid  String    @unique @map("firebase_uid")
  email        String    @unique
  displayName  String?   @map("display_name")
  photoUrl     String?   @map("photo_url")
  currencyCode String    @default("IDR") @map("currency_code")
  isGuest      Boolean   @default(false) @map("is_guest")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  deletedAt    DateTime? @map("deleted_at")
  ...
```

To:

```prisma
model User {
  id           String    @id @default(cuid())
  supabaseUid  String    @unique @map("supabase_uid")
  email        String    @unique
  displayName  String?   @map("display_name")
  photoUrl     String?   @map("photo_url")
  authProvider String    @default("email") @map("auth_provider")
  currencyCode String    @default("IDR") @map("currency_code")
  isGuest      Boolean   @default(false) @map("is_guest")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  deletedAt    DateTime? @map("deleted_at")
  ...
```

Changes:

- `firebaseUid` → `supabaseUid` (Prisma field name)
- `@map("firebase_uid")` → `@map("supabase_uid")` (DB column name)
- Added `authProvider String @default("email") @map("auth_provider")` — stores "email" or "google"

### Step 2: Create migration SQL

Create `apps/api/prisma/migrations/20260502000000_rename_firebase_to_supabase/migration.sql`:

```sql
-- Rename firebase_uid column to supabase_uid
ALTER TABLE "users" RENAME COLUMN "firebase_uid" TO "supabase_uid";

-- Add auth_provider column
ALTER TABLE "users" ADD COLUMN "auth_provider" TEXT NOT NULL DEFAULT 'email';
```

### Step 3: Run migration

```bash
cd apps/api
pnpm prisma migrate deploy
pnpm prisma generate
```

---

## TASK B: Update UserRepository

In `apps/api/src/repositories/user.ts`, change ALL references from `firebaseUid` to `supabaseUid`:

- Line 39: `where: { firebaseUid: supabaseUid }` → `where: { supabaseUid: supabaseUid }` (or shorthand `where: { supabaseUid }`)
- Line 62: `where: { firebaseUid: data.supabaseUid }` → `where: { supabaseUid: data.supabaseUid }` (or shorthand)
- Line 64: `firebaseUid: data.supabaseUid` → `supabaseUid: data.supabaseUid` (or shorthand)

Also update `upsertFromAuth` to accept and store `authProvider`:

```typescript
type UpsertAuthData = {
  supabaseUid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  authProvider?: string;
};
```

And in the create block add: `authProvider: data.authProvider ?? "email"`

---

## TASK C: Update RLS migration

In `apps/api/prisma/migrations/99999999999999_enable_rls/migration.sql`, if it references `firebase_uid`, update to `supabase_uid`.

---

## TASK D: Fix Login Page Stuck on Loading

In `apps/web/src/app/(auth)/login/page.tsx`, the issue is that `apiClient.get("/v1/auth/me")` may hang if the API server is slow or unreachable. The login page also has a race condition with AuthProvider's `onAuthStateChange`.

Fix the `handleSubmit` function:

```typescript
const handleSubmit = async (e: React.FormEvent): Promise<void> => {
  e.preventDefault();
  setError(null);
  setSuccessMessage(null);
  setLoading(true);

  try {
    if (isSignUp) {
      await signUpWithEmail(email, password);
      setSuccessMessage("Cek email lo buat verifikasi akun! 📧");
      setLoading(false);
      return;
    }

    const { session } = await signInWithEmail(email, password);
    if (session) {
      // Provision user in DB with timeout
      try {
        await apiClient.get("/v1/auth/me", {
          headers: { Authorization: `Bearer ${session.access_token}` },
          timeout: 10000,
        });
      } catch {
        // API might be down — still allow navigation since Supabase auth succeeded
        console.warn("Failed to provision user, will retry via AuthProvider");
      }
      document.cookie = "bajes-authenticated=true; Path=/; SameSite=Lax";
      document.cookie = "bajes-guest-mode=; Path=/; Max-Age=0; SameSite=Lax";
    }
    router.push("/dashboard");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan";
    setError(message);
    setLoading(false);
  }
};
```

Key changes:

1. Added `timeout: 10000` to the API call (10 second max)
2. Wrapped API call in inner try/catch — if API fails, still navigate (AuthProvider will retry)
3. `setLoading(false)` only on error or signup — on success we navigate away so loading state doesn't matter
4. Early return after signup success message

---

## TASK E: Update @bajes/types UserDTO (optional)

If `UserDTO` should include `authProvider`, add it to `packages/types/src/dto.ts`:

```typescript
export interface UserDTO {
  id: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  authProvider: string;
  currencyCode: string;
  isGuest: boolean;
  createdAt: string;
}
```

And update the `toUserDTO` function in `user.ts` repository to include `authProvider` in the select and mapping.

---

## Verification

1. `pnpm prisma generate` (in apps/api)
2. `pnpm --filter @bajes/api type-check`
3. `pnpm --filter @bajes/web type-check`
4. `pnpm --filter @bajes/api build`
5. `pnpm --filter @bajes/web build`
6. Runtime: start API, test `/v1/auth/me` with token → user should have `supabase_uid` and `auth_provider` columns
