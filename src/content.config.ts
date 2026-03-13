import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
  }),
});

const explorations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/explorations' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    date: z.string(),
    excerpt: z.string(),
  }),
});

export const collections = { games, explorations };
