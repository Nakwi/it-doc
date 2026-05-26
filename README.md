# IT-DOC — Version HTML/CSS pure

Version statique du site IT-DOC, **sans Astro ni React ni framework**.
Conservée à côté du site Astro pour comparaison.

## Stack
- HTML5 (1 fichier par page)
- CSS3 (`css/style.css` — variables, dark mode, layout, prose)
- JS vanilla (`js/*.js` — pas de dépendance npm)

## Lancer

Soit ouvrir `index.html` directement (`file://`), soit servir le dossier :

```bash
cd html-version
python3 -m http.server 8000
# puis http://localhost:8000
```

> Le `file://` fonctionne aussi mais le bouton « Copier » du code utilise alors le fallback `execCommand` au lieu de l'API Clipboard.

## Structure

```
html-version/
├── index.html                          # Accueil (grille catégories)
├── {categorie}.html                    # 5 pages catégorie
├── {categorie}/{subcategorie}.html     # 7 pages sous-catégorie
├── procedure/{slug}.html               # 7 pages procédure
├── css/style.css                       # Tout le CSS
├── js/
│   ├── data.js                         # Catégories + procédures (source unique)
│   ├── layout.js                       # Injecte header + sidebar
│   ├── main.js                         # Theme, search, copy, TOC scroll-spy
│   ├── category-page.js                # Rend les pages catégorie
│   └── subcategory-page.js             # Rend les pages sous-catégorie
└── images/                             # Copie de public/images
```

## Ce qui marche
- Dark mode (toggle + persistance localStorage)
- Sidebar avec collapse/expand auto par catégorie active
- Recherche live (titre + tags) dans le header
- Page procédure avec TOC sticky + scroll-spy
- Blocs de code style Tokyo Night macOS + bouton Copier
- Responsive (sidebar cachée < 1024px)
- Coloration syntaxique : **non** (Shiki retiré, le code est rendu en monochrome)

## Ajouter une procédure

1. Convertir le `.md` en HTML (cf. `/tmp/md-converter/convert.mjs` qui utilise `marked`)
2. Déposer le fichier dans `procedure/`
3. Ajouter l'entrée dans `js/data.js` (objet `__PROCEDURES__`)

→ C'est **plus lourd que la version Astro** où il suffisait de créer un `.md` avec frontmatter.
