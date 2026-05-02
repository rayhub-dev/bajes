-- Rename firebase_uid column to supabase_uid
ALTER TABLE "users" RENAME COLUMN "firebase_uid" TO "supabase_uid";

-- Add auth_provider column
ALTER TABLE "users" ADD COLUMN "auth_provider" TEXT NOT NULL DEFAULT 'email';
