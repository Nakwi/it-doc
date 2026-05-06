# IT-DOC - Documentation Technique

Site de documentation technique pour les étudiants BTS SIO et Bachelor.

## Stack Technique

- **Astro** - Framework SSG (Static Site Generation)
- **React** - Composants interactifs (Header, Sidebar, SearchBar)
- **Tailwind CSS v4** - Styles (via @tailwindcss/vite)
- **Fuse.js** - Recherche côté client
- **Shiki** - Coloration syntaxique (thème GitHub Dark)
- **Content Collections** - Gestion des procédures Markdown

## Structure du Projet

```
src/
├── components/
│   ├── Breadcrumb.jsx      # Fil d'Ariane
│   ├── Header.jsx          # En-tête avec recherche et dark mode
│   ├── LevelBadge.jsx      # Badge niveau (Débutant/Intermédiaire/Avancé)
│   ├── SearchBar.jsx       # Recherche Fuse.js
│   └── Sidebar.jsx         # Navigation latérale
├── content/
│   ├── config.ts           # Schéma Content Collections
│   └── procedures/         # Fichiers Markdown des procédures
├── data/
│   └── docs.json           # Structure catégories/sous-catégories
├── layouts/
│   └── Layout.astro        # Layout principal
├── pages/
│   ├── index.astro                         # Accueil
│   ├── [categorie]/
│   │   ├── index.astro                     # Liste sous-catégories
│   │   └── [subcategorie]/
│   │       └── index.astro                 # Liste procédures
│   └── procedure/
│       └── [slug].astro                    # Page procédure
└── styles/
    └── global.css          # Styles globaux + prose-content
```

## Catégories Disponibles

| ID | Label | Couleur |
|----|-------|---------|
| windows-server | Windows Server | #0078D4 |
| linux | Linux | #E95420 |
| reseau | Réseau | #00B4D8 |
| securite | Sécurité | #E63946 |
| virtualisation | Virtualisation | #7B2FBE |

Les sous-catégories sont définies dans `src/data/docs.json`.

## Ajouter une Procédure

1. Créer un fichier `.md` dans `src/content/procedures/`
2. Ajouter le frontmatter requis :

```markdown
---
title: "Titre de la procédure"
category: "linux"           # ID de la catégorie
subcategory: "services-reseau"  # ID de la sous-catégorie
level: "Intermédiaire"      # Débutant | Intermédiaire | Avancé
duration: 45                # Durée en minutes
tags: ["tag1", "tag2"]      # Optionnel
cover: "/images/cover.png"  # Optionnel
---

Contenu Markdown ici...
```

3. Le nom du fichier devient le slug de l'URL : `/procedure/[slug]`

## Schéma Content Collections

Défini dans `src/content/config.ts` :

```typescript
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
```

## Fonctionnalités Clés

### Blocs de Code
- Style Tokyo Night avec en-tête macOS (points colorés)
- Affichage du langage
- Bouton "Copier" avec fallback pour HTTP (document.execCommand)
- Implémenté dans `src/pages/procedure/[slug].astro`

### Table des Matières (TOC)
- Affichée à droite sur les pages procédures (xl: breakpoint)
- Scroll spy pour highlight actif
- Extraite automatiquement des h2/h3 du Markdown

### Recherche
- Fuse.js avec recherche sur titre et tags
- Dropdown avec résultats formatés
- Composant : `src/components/SearchBar.jsx`

### Dark Mode
- Toggle dans le Header
- Variables CSS dans `src/styles/global.css`
- Classe `.dark` sur `<html>`

### Comptage des Procédures
- Calculé dynamiquement via `getCollection('procedures')`
- Passé au Sidebar via props depuis Layout.astro
- Affiché sur : accueil, catégories, sous-catégories, sidebar

## Commandes

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run preview  # Preview du build
```

## Déploiement

- Le site est hébergé sur une **VM** (pas Vercel)
- Domaine : **it-doc.fr**
- Build : `npm run build` → génère le dossier `dist/` (écrase l'ancien)
- Le dossier de déploiement sur la VM est `/distrib`
- Après chaque modification : `npm run build` puis copier `dist/` vers `/distrib`
- Serveur de dev accessible sur le réseau local : `npm run dev -- --host 0.0.0.0` → http://192.168.1.66:4321/

## SEO

- Balises Open Graph, Twitter Card, canonical URL dans `Layout.astro`
- Sitemap auto-généré via `@astrojs/sitemap` → `/sitemap-index.xml`
- `robots.txt` dans `public/`
- JSON-LD WebSite sur toutes les pages, TechArticle sur les pages procédures
- Google Search Console : balise meta de vérification dans `Layout.astro`
- Site configuré avec `site: 'https://it-doc.fr'` dans `astro.config.mjs`

## Points Importants

1. **Ne pas modifier docs.json pour ajouter des procédures** - Seule la structure catégories/sous-catégories y est définie. Les procédures viennent des fichiers Markdown.

2. **Images** - Placer dans `public/images/` et référencer avec `/images/...`

3. **Clipboard API** - Le bouton copier utilise un fallback car le site peut être servi en HTTP (pas de localhost).

4. **Styles prose-content** - Les styles Markdown sont dans `global.css` sous `.prose-content`. Inclut listes personnalisées, blockquotes, code inline, etc.

## Architecture des Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | index.astro | Accueil avec grille catégories |
| `/[categorie]` | [categorie]/index.astro | Liste sous-catégories |
| `/[categorie]/[subcategorie]` | [categorie]/[subcategorie]/index.astro | Liste procédures |
| `/procedure/[slug]` | procedure/[slug].astro | Détail procédure |

## Dépendances Principales

```json
{
  "astro": "^5.x",
  "@astrojs/react": "^3.x",
  "react": "^19.x",
  "fuse.js": "^7.x",
  "tailwindcss": "^4.x",
  "@tailwindcss/vite": "^4.x"
}
```
