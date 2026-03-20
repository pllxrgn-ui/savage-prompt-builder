import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function createSharedLinksTable() {
  console.log('Creating shared_links table...');
  
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS shared_links (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now() NOT NULL
      );
    `;

    await db.execute(sql.raw(query));
    console.log('✅ shared_links table created successfully!');
    process.exit(0);

  } catch (err: any) {
    console.error('❌ Failed to create table:', err.message);
    process.exit(1);
  }
}

createSharedLinksTable();
