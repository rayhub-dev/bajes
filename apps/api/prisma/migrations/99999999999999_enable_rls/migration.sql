-- Enable Row Level Security on all tables
-- Note: Prisma uses a service role key that bypasses RLS.
-- userId is ALWAYS taken from the server-side session, NOT from request body.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own data
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
    EXECUTE 'CREATE POLICY "users_own_data" ON users FOR ALL USING (id = auth.uid()::text)';
    EXECUTE 'CREATE POLICY "sessions_own_data" ON sessions FOR ALL USING (user_id = auth.uid()::text)';
    EXECUTE 'CREATE POLICY "transactions_own_data" ON transactions FOR ALL USING (user_id = auth.uid()::text)';
    EXECUTE 'CREATE POLICY "budgets_own_data" ON budgets FOR ALL USING (user_id = auth.uid()::text)';
    EXECUTE 'CREATE POLICY "categories_own_data" ON categories FOR ALL USING (user_id = auth.uid()::text OR user_id IS NULL)';
    EXECUTE 'CREATE POLICY "push_subscriptions_own_data" ON push_subscriptions FOR ALL USING (user_id = auth.uid()::text)';
    EXECUTE 'CREATE POLICY "audit_logs_own_data" ON audit_logs FOR ALL USING (user_id = auth.uid()::text)';
  END IF;
END
$$;
