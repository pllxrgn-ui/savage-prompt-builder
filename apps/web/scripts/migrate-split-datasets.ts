import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Using direct connection (port 5432) for DDL
const raw = process.env.DATABASE_URL!;
const directUrl = raw.replace(':6543/', ':5432/');

async function migrate() {
  const sql = postgres(directUrl, { prepare: false, max: 1 });
  
  try {
    console.log('--- Feedback Splitting Migration ---');
    
    // 1. Create positive_dataset table
    console.log('Creating positive_dataset...');
    await sql`
      CREATE TABLE IF NOT EXISTS "positive_dataset" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "generation_id" text NOT NULL REFERENCES "generations"("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "prompt" text NOT NULL,
        "metadata" jsonb,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `;

    // 2. Create negative_dataset table
    console.log('Creating negative_dataset...');
    await sql`
      CREATE TABLE IF NOT EXISTS "negative_dataset" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "generation_id" text NOT NULL REFERENCES "generations"("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "prompt" text NOT NULL,
        "metadata" jsonb,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `;

    // 3. Drop old consolidated table (if it exists)
    console.log('Cleaning up old prompt_feedback table...');
    await sql`DROP TABLE IF EXISTS "prompt_feedback" CASCADE;`;

    console.log('✅ Success! Your datasets are now physically separated.');
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

migrate();
