import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    categories: z.array(z.string()).default([]),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    hidden: z.boolean().default(false),
    series: z.string().optional(),
    seriesOrder: z.number().optional()
  })
});

export const collections = { posts };
