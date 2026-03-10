import { pgTable, text, timestamp, boolean, jsonb, uuid, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    name: text('name'),
    avatar: text('avatar'),
    tier: text('tier').default('free').notNull(),
    stripeCustomerId: text('stripe_customer_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const prompts = pgTable('prompts', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    templateId: text('template_id').notNull(),
    generator: text('generator').notNull(),
    promptText: text('prompt_text').notNull(),
    fieldData: jsonb('field_data'),
    styles: jsonb('styles'), // array of style IDs or names
    palettes: jsonb('palettes'), // array of palette IDs
    keywords: jsonb('keywords'), // array of keyword IDs
    negative: text('negative'),
    projectId: text('project_id'),
    rating: integer('rating'), // 1-5
    note: text('note'),
    versionToken: text('version_token'), // iteration chain tracking
    parentId: uuid('parent_id'), // hierarchical reference for iterate
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recipes = pgTable('recipes', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    templateId: text('template_id').notNull(),
    fieldData: jsonb('field_data').notNull(),
    styles: jsonb('styles').notNull(),
    palettes: jsonb('palettes'),
    keywords: jsonb('keywords'),
    negative: text('negative'),
    generatorId: text('generator_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const customStyles = pgTable('custom_styles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    content: text('content').notNull(),
    templateId: text('template_id'),
    category: text('category'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const customPalettes = pgTable('custom_palettes', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    colors: jsonb('colors').notNull(), // array of hex codes
    typeDesc: text('type_desc'),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const media = pgTable('media', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    promptId: uuid('prompt_id').references(() => prompts.id, { onDelete: 'set null' }),
    url: text('url').notNull(),
    provider: text('provider').notNull(),
    model: text('model'),
    metadata: jsonb('metadata'), // config details, dimensions
    starred: boolean('starred').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
