import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const raw = process.env.DATABASE_URL!;
const directUrl = raw.replace(':6543/', ':5432/');

async function migrate() {
  const sql = postgres(directUrl, { prepare: false, max: 1 });
  try {
    console.log('Adding type column to generations table...');
    await sql`ALTER TABLE "generations" ADD COLUMN IF NOT EXISTS "type" text NOT NULL DEFAULT 'image'`;
    console.log('✅ Success.');
  } catch (err: any) {
    console.error('❌ Failed:', err.message);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

migrate();
