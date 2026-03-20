import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Using direct connection (port 5432) for DDL
const raw = process.env.DATABASE_URL!;
const directUrl = raw.replace(':6543/', ':5432/');

async function setupRLS() {
  console.log('--- Setting up RLS for split datasets ---');
  const sql = postgres(directUrl, { prepare: false, max: 1 });

  try {
    const commands = [
      // 1. Enable RLS
      `ALTER TABLE "positive_dataset" ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "negative_dataset" ENABLE ROW LEVEL SECURITY;`,

      // 2. Drop existing policies (if run previous)
      `DROP POLICY IF EXISTS "Users can view own positive data" ON "positive_dataset";`,
      `DROP POLICY IF EXISTS "Users can insert own positive data" ON "positive_dataset";`,
      `DROP POLICY IF EXISTS "Users can view own negative data" ON "negative_dataset";`,
      `DROP POLICY IF EXISTS "Users can insert own negative data" ON "negative_dataset";`,

      // 3. Create new Policies
      `CREATE POLICY "Users can view own positive data" ON "positive_dataset" FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert own positive data" ON "positive_dataset" FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      
      `CREATE POLICY "Users can view own negative data" ON "negative_dataset" FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert own negative data" ON "negative_dataset" FOR INSERT WITH CHECK (auth.uid() = user_id);`,
    ];

    for (const statement of commands) {
      await sql.unsafe(statement);
    }
    
    console.log('✅ RLS for datasets fully configured!');
    await sql.end();
    process.exit(0);

  } catch (err: any) {
    console.error('❌ Failed:', err.message);
    await sql.end();
    process.exit(1);
  }
}

setupRLS();
