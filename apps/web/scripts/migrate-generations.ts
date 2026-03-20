import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Transaction pooler (port 6543) can't run DDL statements.
// Derive the direct connection URL by switching to the direct pooler host/port.
// Pooler URL format: postgresql://postgres.<project>:<pass>@aws-*.pooler.supabase.com:6543/postgres
// Direct URL format: postgresql://postgres.<project>:<pass>@aws-*.pooler.supabase.com:5432/postgres
const raw = process.env.DATABASE_URL!;
const directUrl = raw.replace(':6543/', ':5432/');

async function migrate() {
  console.log('Connecting directly (port 5432) to run DDL...');
  const sql = postgres(directUrl, { prepare: false, max: 1 });

  try {
    console.log('Creating generations table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "generations" (
        "id"           text PRIMARY KEY,
        "user_id"      uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "status"       text NOT NULL DEFAULT 'pending',
        "prompt"       text NOT NULL,
        "model"        text NOT NULL,
        "count"        integer NOT NULL DEFAULT 1,
        "aspect_ratio" text NOT NULL DEFAULT '1:1',
        "images"       jsonb,
        "error"        text,
        "created_at"   timestamp NOT NULL DEFAULT now(),
        "completed_at" timestamp
      );
    `;

    console.log('✅ generations table OK.');
    await sql.end();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    await sql.end();
    process.exit(1);
  }
}

migrate();
