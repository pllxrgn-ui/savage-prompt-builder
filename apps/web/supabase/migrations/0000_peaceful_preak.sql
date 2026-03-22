CREATE TABLE IF NOT EXISTS "custom_palettes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"colors" jsonb NOT NULL,
	"type_desc" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "custom_styles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"template_id" text,
	"category" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "generations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text DEFAULT 'image' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"prompt" text NOT NULL,
	"model" text NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"aspect_ratio" text DEFAULT '1:1' NOT NULL,
	"images" jsonb,
	"error" text,
	"feedback_submitted" boolean DEFAULT false NOT NULL,
	"is_rewarded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);

CREATE TABLE IF NOT EXISTS "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"prompt_id" uuid,
	"url" text NOT NULL,
	"provider" text NOT NULL,
	"model" text,
	"metadata" jsonb,
	"starred" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "negative_dataset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generation_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"prompt" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "positive_dataset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generation_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"prompt" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"template_id" text NOT NULL,
	"generator" text NOT NULL,
	"prompt_text" text NOT NULL,
	"field_data" jsonb,
	"styles" jsonb,
	"palettes" jsonb,
	"keywords" jsonb,
	"negative" text,
	"project_id" text,
	"rating" integer,
	"note" text,
	"version_token" text,
	"parent_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"template_id" text NOT NULL,
	"field_data" jsonb NOT NULL,
	"styles" jsonb NOT NULL,
	"palettes" jsonb,
	"keywords" jsonb,
	"negative" text,
	"generator_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "shared_links" (
	"id" text PRIMARY KEY NOT NULL,
	"payload" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar" text,
	"tier" text DEFAULT 'free' NOT NULL,
	"credits" integer DEFAULT 100 NOT NULL,
	"stripe_customer_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Safely add potentially missing columns for existing tables
ALTER TABLE "generations" ADD COLUMN IF NOT EXISTS "feedback_submitted" boolean DEFAULT false NOT NULL;
ALTER TABLE "generations" ADD COLUMN IF NOT EXISTS "is_rewarded" boolean DEFAULT false NOT NULL;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tier" text DEFAULT 'free' NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "credits" integer DEFAULT 100 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;

-- Safely add Foreign Keys
DO $$ BEGIN
 ALTER TABLE "custom_palettes" ADD CONSTRAINT "custom_palettes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
 ALTER TABLE "custom_styles" ADD CONSTRAINT "custom_styles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
 ALTER TABLE "generations" ADD CONSTRAINT "generations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
 ALTER TABLE "negative_dataset" ADD CONSTRAINT "negative_dataset_generation_id_generations_id_fk" FOREIGN KEY ("generation_id") REFERENCES "public"."generations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
 ALTER TABLE "negative_dataset" ADD CONSTRAINT "negative_dataset_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
 ALTER TABLE "positive_dataset" ADD CONSTRAINT "positive_dataset_generation_id_generations_id_fk" FOREIGN KEY ("generation_id") REFERENCES "public"."generations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
 ALTER TABLE "positive_dataset" ADD CONSTRAINT "positive_dataset_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
 ALTER TABLE "prompts" ADD CONSTRAINT "prompts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
 ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;