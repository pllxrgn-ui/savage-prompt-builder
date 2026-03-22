-- Enable Row Level Security on all tables (safe to run multiple times)
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prompts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recipes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "custom_styles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "custom_palettes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "generations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "positive_dataset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "negative_dataset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shared_links" ENABLE ROW LEVEL SECURITY;

-- Users Table
DO $$ BEGIN CREATE POLICY "Users can read own profile" ON "users" FOR SELECT USING (auth.uid() = id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can update own profile" ON "users" FOR UPDATE USING (auth.uid() = id); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Prompts Table
DO $$ BEGIN CREATE POLICY "Users can read own prompts" ON "prompts" FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can insert own prompts" ON "prompts" FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can update own prompts" ON "prompts" FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can delete own prompts" ON "prompts" FOR DELETE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Recipes Table
DO $$ BEGIN CREATE POLICY "Users can read own recipes" ON "recipes" FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can insert own recipes" ON "recipes" FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can update own recipes" ON "recipes" FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can delete own recipes" ON "recipes" FOR DELETE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Custom Styles Table
DO $$ BEGIN CREATE POLICY "Users can read own styles" ON "custom_styles" FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can insert own styles" ON "custom_styles" FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can update own styles" ON "custom_styles" FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can delete own styles" ON "custom_styles" FOR DELETE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Custom Palettes Table
DO $$ BEGIN CREATE POLICY "Users can read own palettes" ON "custom_palettes" FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can insert own palettes" ON "custom_palettes" FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can update own palettes" ON "custom_palettes" FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can delete own palettes" ON "custom_palettes" FOR DELETE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Media Table
DO $$ BEGIN CREATE POLICY "Users can read own media" ON "media" FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can insert own media" ON "media" FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can update own media" ON "media" FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can delete own media" ON "media" FOR DELETE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Generations Table
DO $$ BEGIN CREATE POLICY "Users can read own generations" ON "generations" FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can insert own generations" ON "generations" FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can update own generations" ON "generations" FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can delete own generations" ON "generations" FOR DELETE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Positive Dataset Table (Only insert and select own)
DO $$ BEGIN CREATE POLICY "Users can read own positive dataset rows" ON "positive_dataset" FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can insert own positive dataset rows" ON "positive_dataset" FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Negative Dataset Table
DO $$ BEGIN CREATE POLICY "Users can read own negative dataset rows" ON "negative_dataset" FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can insert own negative dataset rows" ON "negative_dataset" FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Shared Links Table
-- Anyone can read shared links payloads if they have the ID
DO $$ BEGIN CREATE POLICY "Anyone can read shared links" ON "shared_links" FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
-- Only authenticated users can insert link payloads
DO $$ BEGIN CREATE POLICY "Authenticated users can insert shared links" ON "shared_links" FOR INSERT TO authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;

