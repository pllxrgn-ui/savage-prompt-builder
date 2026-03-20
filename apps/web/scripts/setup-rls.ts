import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Transaction pooler (port 6543) blocks DDL; switch to direct connection (port 5432)
const raw = process.env.DATABASE_URL!;
const directUrl = raw.replace(':6543/', ':5432/');

async function setupRLS() {
  console.log('Setting up Row Level Security (RLS) on Supabase tables...');
  const sql = postgres(directUrl, { prepare: false, max: 1 });

  try {
    const commands = [
      // 1. Enable RLS on all tables
      `ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "prompts" ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "recipes" ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "custom_styles" ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "custom_palettes" ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "media" ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "shared_links" ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "generations" ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE "prompt_feedback" ENABLE ROW LEVEL SECURITY;`,

      // 2. Drop existing policies if running this multiple times
      `DROP POLICY IF EXISTS "Users can view own profile" ON "users";`,
      `DROP POLICY IF EXISTS "Users can update own profile" ON "users";`,
      
      `DROP POLICY IF EXISTS "Users can view own prompts" ON "prompts";`,
      `DROP POLICY IF EXISTS "Users can insert own prompts" ON "prompts";`,
      `DROP POLICY IF EXISTS "Users can update own prompts" ON "prompts";`,
      `DROP POLICY IF EXISTS "Users can delete own prompts" ON "prompts";`,
      
      `DROP POLICY IF EXISTS "Users can view own recipes" ON "recipes";`,
      `DROP POLICY IF EXISTS "Users can insert own recipes" ON "recipes";`,
      `DROP POLICY IF EXISTS "Users can update own recipes" ON "recipes";`,
      `DROP POLICY IF EXISTS "Users can delete own recipes" ON "recipes";`,
      
      `DROP POLICY IF EXISTS "Users can view own styles" ON "custom_styles";`,
      `DROP POLICY IF EXISTS "Users can insert own styles" ON "custom_styles";`,
      `DROP POLICY IF EXISTS "Users can update own styles" ON "custom_styles";`,
      `DROP POLICY IF EXISTS "Users can delete own styles" ON "custom_styles";`,

      `DROP POLICY IF EXISTS "Users can view own palettes" ON "custom_palettes";`,
      `DROP POLICY IF EXISTS "Users can insert own palettes" ON "custom_palettes";`,
      `DROP POLICY IF EXISTS "Users can update own palettes" ON "custom_palettes";`,
      `DROP POLICY IF EXISTS "Users can delete own palettes" ON "custom_palettes";`,

      `DROP POLICY IF EXISTS "Users can view own media" ON "media";`,
      `DROP POLICY IF EXISTS "Users can insert own media" ON "media";`,
      `DROP POLICY IF EXISTS "Users can update own media" ON "media";`,
      `DROP POLICY IF EXISTS "Users can delete own media" ON "media";`,

      `DROP POLICY IF EXISTS "Anyone can read shared links" ON "shared_links";`,
      `DROP POLICY IF EXISTS "Authenticated users can create shared links" ON "shared_links";`,

      `DROP POLICY IF EXISTS "Users can view own generations" ON "generations";`,
      `DROP POLICY IF EXISTS "Users can insert own generations" ON "generations";`,
      `DROP POLICY IF EXISTS "Users can update own generations" ON "generations";`,

      `DROP POLICY IF EXISTS "Users can view own feedback" ON "prompt_feedback";`,
      `DROP POLICY IF EXISTS "Users can insert own feedback" ON "prompt_feedback";`,
      `DROP POLICY IF EXISTS "Users can update own feedback" ON "prompt_feedback";`,


      // 3. Create new Policies
      
      // Users table
      `CREATE POLICY "Users can view own profile" ON "users" FOR SELECT USING (auth.uid() = id);`,
      `CREATE POLICY "Users can update own profile" ON "users" FOR UPDATE USING (auth.uid() = id);`,

      // Prompts table
      `CREATE POLICY "Users can view own prompts" ON "prompts" FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert own prompts" ON "prompts" FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update own prompts" ON "prompts" FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete own prompts" ON "prompts" FOR DELETE USING (auth.uid() = user_id);`,

      // Recipes table
      `CREATE POLICY "Users can view own recipes" ON "recipes" FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert own recipes" ON "recipes" FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update own recipes" ON "recipes" FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete own recipes" ON "recipes" FOR DELETE USING (auth.uid() = user_id);`,

      // Custom Styles table
      `CREATE POLICY "Users can view own styles" ON "custom_styles" FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert own styles" ON "custom_styles" FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update own styles" ON "custom_styles" FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete own styles" ON "custom_styles" FOR DELETE USING (auth.uid() = user_id);`,

      // Custom Palettes table
      `CREATE POLICY "Users can view own palettes" ON "custom_palettes" FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert own palettes" ON "custom_palettes" FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update own palettes" ON "custom_palettes" FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete own palettes" ON "custom_palettes" FOR DELETE USING (auth.uid() = user_id);`,

      // Media table
      `CREATE POLICY "Users can view own media" ON "media" FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert own media" ON "media" FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update own media" ON "media" FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete own media" ON "media" FOR DELETE USING (auth.uid() = user_id);`,

      // Shared Links
      `CREATE POLICY "Anyone can read shared links" ON "shared_links" FOR SELECT USING (true);`,
      `CREATE POLICY "Authenticated users can create shared links" ON "shared_links" FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);`,

      // Generations
      `CREATE POLICY "Users can view own generations" ON "generations" FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert own generations" ON "generations" FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update own generations" ON "generations" FOR UPDATE USING (auth.uid() = user_id);`,

      // Feedback Table
      `CREATE POLICY "Users can view own feedback" ON "prompt_feedback" FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert own feedback" ON "prompt_feedback" FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update own feedback" ON "prompt_feedback" FOR UPDATE USING (auth.uid() = user_id);`,
    ];

    for (const statement of commands) {
      await sql.unsafe(statement);
    }
    
    console.log('✅ Row Level Security fully enabled and configured!');
    await sql.end();
    process.exit(0);

  } catch (err: any) {
    console.error('❌ Failed to setup RLS:', err.message);
    await sql.end();
    process.exit(1);
  }
}

setupRLS();
