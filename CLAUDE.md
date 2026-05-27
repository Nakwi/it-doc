# IT-DOC - Documentation Technique

Site de documentation technique pour les étudiants BTS SIO et Bachelor.

Hébergé sur une VM, domaine : **it-doc.fr**.

## Stack Technique

- **HTML5** - 1 fichier par page
- **CSS3** - `css/style.css` (variables, dark mode, layout, prose)
- **JavaScript vanilla** - aucune dépendance npm

> Précédemment construit avec Astro + React + Tailwind, migré en HTML/CSS/JS pur car la stack était overkill pour un site de doc statique.

## Structure du Projet

```
.
├── index.html                          # Accueil (grille catégories)
├── 404.html                            # Page d'erreur
├── a-propos.html                       # À propos
├── tags.html                           # Page tags
├── {categorie}.html                    # 5 pages catégorie (linux, windows-server, etc.)
├── {categorie}/{subcategorie}.html     # Pages sous-catégorie
├── procedure/{slug}.html               # Pages procédure
├── css/
│   └── style.css                       # Tout le CSS
├── js/
│   ├── data.js                         # Catégories + procédures (source unique)
│   ├── layout.js                       # Injecte header + sidebar
│   ├── main.js                         # Theme, search, copy, TOC scroll-spy
│   ├── category-page.js                # Rend les pages catégorie
│   └── subcategory-page.js             # Rend les pages sous-catégorie
└── images/                             # Assets (organisés par procédure)
```

## Catégories Disponibles

| ID | Label | Couleur |
|----|-------|---------|
| windows-server | Windows Server | #0078D4 |
| linux | Linux | #E95420 |
| reseau | Réseau | #00B4D8 |
| securite | Sécurité | #E63946 |
| virtualisation | Virtualisation | #7B2FBE |
| powershell | PowerShell | #012456 |

Les catégories, sous-catégories et procédures sont définies dans `js/data.js`.

## Ajouter une Procédure

1. Écrire le `.md` dans `procedures-md/<slug>.md` avec frontmatter YAML :
   ```
   ---
   title: "..."
   category: linux            # doit matcher un id de __CATEGORIES__
   subcategory: services-reseau
   level: Débutant|Intermédiaire|Avancé
   duration: 45               # minutes
   tags: ["Tag1", "Tag2"]
   cover: images/<slug>/cover.png
   ---
   ```
2. Déposer les screenshots dans `images/<slug>/` (référencés `/images/<slug>/...` dans le MD)
3. Lancer `node scripts/convert.mjs` (tous les MD) ou `node scripts/convert.mjs <fichier.md>` (un seul)
   - Génère `procedure/<slug>.html` avec la DA standard (TOC sticky, code-blocks Tokyo Night, breadcrumb, tags, etc.)
   - Auto-patch `js/data.js` (insère l'entrée dans `__PROCEDURES__` si le slug n'existe pas)
4. Tester en local, commit, déployer

## Fonctionnalités

- **Dark mode** : toggle dans le header, persistance localStorage
- **Sidebar** : collapse/expand auto par catégorie active, cachée < 1024px
- **Recherche live** : titre + tags depuis le header
- **TOC procédure** : sticky + scroll-spy
- **Blocs de code** : style Tokyo Night macOS, bouton Copier (avec fallback `execCommand` pour HTTP)
- **Pas de coloration syntaxique** : Shiki retiré lors de la migration, le code est rendu en monochrome

## Lancer en local

```bash
# Soit ouvrir index.html directement (file://)
# Soit servir le dossier :
python3 -m http.server 8000
# puis http://localhost:8000
```

## Déploiement

- Hébergé sur une **VM** (pas Vercel)
- Domaine : **it-doc.fr**
- Pas de build : copier directement le contenu du repo vers `/distrib` sur la VM
- Serveur local accessible sur le réseau : `python3 -m http.server 8000 --bind 0.0.0.0`

## SEO

- Balises Open Graph, Twitter Card, canonical URL dans chaque `<head>`
- `robots.txt` à la racine
- Google Search Console : balise meta de vérification dans le `<head>`

## Points Importants

1. **Source unique des procédures** : `js/data.js` — ajouter une procédure HTML sans l'enregistrer ici ne suffira pas.
2. **Images** : `images/` à la racine, référencées en chemin absolu `/images/...`
3. **Clipboard API** : le bouton copier utilise un fallback car le site est servi en HTTP (pas de localhost).
4. **Styles `prose-content`** : les styles Markdown sont dans `css/style.css` sous `.prose-content`.

## Architecture des Routes

| Route | Fichier |
|-------|---------|
| `/` | `index.html` |
| `/[categorie].html` | Pages catégorie (5) |
| `/[categorie]/[subcategorie].html` | Pages sous-catégorie |
| `/procedure/[slug].html` | Pages procédure |
| `/a-propos.html` | À propos |
| `/tags.html` | Tags |
| `/404.html` | Page d'erreur |
