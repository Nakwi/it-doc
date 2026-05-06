// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

// Custom sanitize schema - allow safe HTML elements used in documentation
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': ['className', 'class', 'id'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    a: ['href', 'title', 'target', 'rel'],
    code: ['className', 'class'],
    pre: ['className', 'class'],
    span: ['className', 'class', 'style'],
  },
  tagNames: defaultSchema.tagNames?.filter(
    tag => !['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea'].includes(tag)
  ),
};

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://it-doc.fr',

  server: {
    host: process.env.DEV_HOST || 'localhost',
    port: parseInt(process.env.DEV_PORT || '4321'),
  },

  integrations: [
    react(),
    sitemap(),
  ],

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    rehypePlugins: [[rehypeSanitize, sanitizeSchema]],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
