// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

// Custom sanitize schema - allow safe HTML elements used in documentation
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Allow class attributes for styling
    '*': ['className', 'class', 'id'],
    // Allow src, alt, title for images
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    // Allow href for links (external links will be handled by CSP)
    a: ['href', 'title', 'target', 'rel'],
    // Allow code block attributes
    code: ['className', 'class'],
    pre: ['className', 'class'],
    span: ['className', 'class', 'style'],
  },
  // Block dangerous tags
  tagNames: defaultSchema.tagNames?.filter(
    tag => !['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea'].includes(tag)
  ),
};

// https://astro.build/config
export default defineConfig({
  server: {
    // Use environment variable or default to localhost for security
    host: process.env.DEV_HOST || 'localhost',
    port: parseInt(process.env.DEV_PORT || '4321'),
  },

  integrations: [react()],

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    // Sanitize HTML in Markdown to prevent XSS
    rehypePlugins: [[rehypeSanitize, sanitizeSchema]],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
