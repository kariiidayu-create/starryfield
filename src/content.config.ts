import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const interaction = z.string().optional();

const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/games' }),
  schema: z.object({
    title: z.string(),
    platform: z.string(),
    tag: z.string(),
    cover: z.string().optional(),
    rating: z.string().optional(),
    note: z.string(),
    order: z.number().optional(),
    interaction,
  }),
});

const explorations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/explorations' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    date: z.string(),
    excerpt: z.string(),
    location: z.object({ name: z.string(), lat: z.number(), lng: z.number() }).optional(),
    interaction,
  }),
});

const crafts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/crafts' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    date: z.string(),
    cover: z.string(),
    note: z.string(),
    order: z.number().optional(),
    process: z.array(z.object({ src: z.string(), label: z.string().optional() })).optional(),
    interaction,
  }),
});

const drawings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/drawings' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    date: z.string(),
    cover: z.string(),
    note: z.string(),
    order: z.number().optional(),
    process: z.array(z.object({ src: z.string(), label: z.string().optional() })).optional(),
    interaction,
  }),
});

const cooking = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cooking' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    date: z.string(),
    cover: z.string(),
    note: z.string(),
    order: z.number().optional(),
    interaction,
  }),
});

const photos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/photos' }),
  schema: z.object({
    title: z.string().optional(),
    src: z.string(),
    date: z.string(),
    location: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const bookmarks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bookmarks' }),
  schema: z.object({
    title: z.string(),
    url: z.string(),
    category: z.string(),
    description: z.string(),
    date: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = { games, explorations, crafts, drawings, cooking, photos, bookmarks };
