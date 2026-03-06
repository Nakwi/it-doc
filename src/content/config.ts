import { defineCollection, z } from 'astro:content';

const procedures = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    subcategory: z.string(),
    level: z.enum(['Débutant', 'Intermédiaire', 'Avancé']),
    duration: z.number(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
  }),
});

export const collections = {
  procedures,
};
