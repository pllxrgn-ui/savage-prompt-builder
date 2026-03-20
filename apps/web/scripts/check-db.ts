import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const raw = process.env.DATABASE_URL!;
const directUrl = raw.replace(':6543/', ':5432/');

async function check() {
  const sql = postgres(directUrl, { prepare: false, max: 1 });
  
  try {
    console.log('\n--- 🚀 Supabase Table Check ---');
    
    // 1. List all relevant tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name LIKE '%dataset%' OR table_name = 'generations')
      ORDER BY table_name;
    `;
    
    console.log('Tables Found:');
    tables.forEach(t => console.log(` - ${t.table_name}`));

    // 2. Check structure of positive_dataset
    console.log('\n--- 📈 Structure: positive_dataset ---');
    const posCols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'positive_dataset'
      ORDER BY ordinal_position;
    `;
    posCols.forEach(c => console.log(` [${c.column_name}] : ${c.data_type}`));

    // 3. Count rows
    const posCount = await sql`SELECT count(*) FROM positive_dataset;`;
    const negCount = await sql`SELECT count(*) FROM negative_dataset;`;
    
    console.log(`\nRow counts:`);
    console.log(` - positive_dataset: ${posCount[0].count}`);
    console.log(` - negative_dataset: ${negCount[0].count}`);

  } catch (err: any) {
    console.error('Check failed:', err.message);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

check();
