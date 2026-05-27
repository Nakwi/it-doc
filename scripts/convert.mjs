// IT-DOC procedure builder
// Converts a .md (frontmatter + body) into procedure/<slug>.html
// and inserts the corresponding entry into js/data.js if absent.
//
// Usage:
//   node convert.mjs                      # convert all .md in ../procedures-md/
//   node convert.mjs <file.md>            # convert one specific file
//
// MD frontmatter expected:
//   ---
//   title: "..."
//   category: linux
//   subcategory: services-reseau
//   level: Intermédiaire
//   duration: 45
//   tags: ["BIND9", "DNS"]
//   cover: images/bind9/bind9_cover.png
//   ---

import { marked, Renderer } from 'marked';
import fs from 'fs';
import path from 'path';
import url from 'url';
import vm from 'vm';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MD_DIR = path.join(ROOT, 'procedures-md');
const OUT_DIR = path.join(ROOT, 'procedure');
const DATA_FILE = path.join(ROOT, 'js', 'data.js');

// ============ FRONTMATTER PARSER ============
function parseFile(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: content };
  const meta = {};
  m[1].split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i > 0) {
      const k = line.slice(0, i).trim();
      let v = line.slice(i + 1).trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      meta[k] = v;
    }
  });
  return { meta, body: m[2] };
}

function parseTags(raw) {
  if (!raw) return [];
  return raw.replace(/^\[|\]$/g, '')
    .split(',')
    .map(t => t.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
}

// ============ SLUGIFY ============
function slugify(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============ MARKED RENDERER (Tokyo Night code blocks + custom heading/img/link) ============
const renderer = new Renderer();

renderer.heading = ({ tokens, depth }) => {
  const text = tokens.map(t => t.raw || t.text).join('');
  const id = slugify(text);
  const html = marked.parser(tokens, { renderer: marked.defaults.renderer }).replace(/^<p>|<\/p>\n?$/g, '');
  return `<h${depth} id="${id}">${html}</h${depth}>\n`;
};

renderer.code = ({ text, lang }) => {
  const language = (lang || 'code').toLowerCase();
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<div class="code-block">
  <div class="code-header">
    <div class="code-dots"><span></span><span></span><span></span></div>
    <span class="code-lang">${language}</span>
    <button class="copy-btn" type="button"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Copier</button>
  </div>
  <pre><code class="language-${language}">${escaped}</code></pre>
</div>\n`;
};

// Images: /images/... -> ../images/... (procedure pages are one level deep)
renderer.image = ({ href, title, text }) => {
  let src = href;
  if (src.startsWith('/')) src = '..' + src;
  return `<img src="${src}" alt="${text || ''}"${title ? ` title="${title}"` : ''} />`;
};

// External links: target=_blank + nofollow
renderer.link = ({ href, title, tokens }) => {
  const text = marked.parser(tokens, { renderer: marked.defaults.renderer }).replace(/^<p>|<\/p>\n?$/g, '');
  const isExternal = /^https?:\/\//.test(href);
  const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer nofollow"' : '';
  return `<a href="${href}"${title ? ` title="${title}"` : ''}${attrs}>${text}</a>`;
};

marked.use({ renderer, gfm: true, breaks: false });

// ============ TOC EXTRACTION ============
function extractToc(body) {
  const toc = [];
  body.split('\n').forEach(line => {
    const m = line.match(/^(##|###)\s+(.+?)\s*$/);
    if (m) {
      const depth = m[1].length;
      const text = m[2].replace(/\[(.*?)\]\(.*?\)/g, '$1');
      toc.push({ depth, text, slug: slugify(text) });
    }
  });
  return toc;
}

// ============ LOAD data.js (single source of truth for categories) ============
function loadDataJs() {
  const content = fs.readFileSync(DATA_FILE, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);
  return {
    content,
    categories: sandbox.window.__CATEGORIES__ || [],
    procedures: sandbox.window.__PROCEDURES__ || []
  };
}

// ============ PATCH data.js ============
function patchDataJs(slug, meta, tags, categories, procedures, originalContent) {
  if (procedures.some(p => p.id === slug)) {
    return { patched: false, reason: 'already present' };
  }

  const cat = categories.find(c => c.id === meta.category);
  const sub = cat?.subcategories.find(s => s.id === meta.subcategory);
  if (!cat) throw new Error(`Unknown category: ${meta.category}`);
  if (!sub) throw new Error(`Unknown subcategory: ${meta.subcategory} in ${meta.category}`);

  const entry = `  {
    id: '${slug}',
    title: ${JSON.stringify(meta.title)},
    category: '${meta.category}', categoryLabel: ${JSON.stringify(cat.label)},
    subcategory: '${meta.subcategory}', subcategoryLabel: ${JSON.stringify(sub.label)},
    level: ${JSON.stringify(meta.level)}, duration: ${Number(meta.duration)},
    tags: [${tags.map(t => JSON.stringify(t)).join(', ')}],
    cover: ${JSON.stringify(meta.cover || '')}
  }`;

  const re = /(window\.__PROCEDURES__\s*=\s*\[)([\s\S]*?)(\n\];)/;
  const m = originalContent.match(re);
  if (!m) throw new Error('Could not locate window.__PROCEDURES__ in data.js');

  const arrayBody = m[2];
  const isEmpty = arrayBody.trim() === '';
  const newBody = isEmpty
    ? `\n${entry}`
    : `${arrayBody.replace(/\s*$/, '')},\n${entry}`;

  const next = originalContent.replace(re, `$1${newBody}$3`);
  fs.writeFileSync(DATA_FILE, next);
  return { patched: true };
}

// ============ CONVERT ONE FILE ============
function convertOne(srcPath, data) {
  const content = fs.readFileSync(srcPath, 'utf8');
  const { meta, body } = parseFile(content);
  const slug = path.basename(srcPath, '.md');

  // Validate required meta
  const required = ['title', 'category', 'subcategory', 'level', 'duration'];
  for (const k of required) {
    if (!meta[k]) throw new Error(`[${slug}] frontmatter missing: ${k}`);
  }

  // Strip the leading "# Title" (the page already shows the title in proc-header)
  // and the "## Sommaire" block (we render our own TOC).
  const cleanBody = body
    .replace(/^\s*#\s+[^\n]+\n+/, '')
    .replace(/^## Sommaire[\s\S]*?(?=^## |^# )/m, '');
  const html = marked.parse(cleanBody);
  const toc = extractToc(cleanBody);
  const tags = parseTags(meta.tags);

  const cat = data.categories.find(c => c.id === meta.category);
  const sub = cat?.subcategories.find(s => s.id === meta.subcategory);
  if (!cat) throw new Error(`[${slug}] unknown category: ${meta.category}`);
  if (!sub) throw new Error(`[${slug}] unknown subcategory: ${meta.subcategory}`);

  const levelClass = 'badge-' + meta.level.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const tocHtml = toc.length === 0 ? '' : `
        <aside class="toc-wrap">
          <div class="toc-sticky">
            <div class="toc-box">
              <h4 class="toc-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
                Sommaire
              </h4>
              <nav>
                <ul class="toc-list">
                  ${toc.map(h => `<li><a href="#${h.slug}" class="toc-link${h.depth === 3 ? ' depth-3' : ''}" data-id="${h.slug}">${h.text}</a></li>`).join('\n                  ')}
                </ul>
              </nav>
            </div>
          </div>
        </aside>`;

  const tagsHtml = tags.map(t => `<a href="../tags.html?tag=${encodeURIComponent(t)}" class="tag">${t}</a>`).join('\n            ');

  const page = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title} | IT-DOC</title>
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="icon" type="image/svg+xml" href="../images/it-doc.svg" />
  <script>
    if (localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  </script>
</head>
<body data-base="../" data-current-path="/${meta.category}/${meta.subcategory}">

  <main data-content>
    <div class="container">
      <div class="proc-layout">
        <div class="proc-main">
          <a href="../${meta.category}/${meta.subcategory}.html" class="back-link">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Retour
          </a>

          <nav class="breadcrumb">
            <a href="../index.html">Accueil</a>
            <span class="sep">/</span>
            <a href="../${meta.category}.html">${cat.label}</a>
            <span class="sep">/</span>
            <a href="../${meta.category}/${meta.subcategory}.html">${sub.label}</a>
            <span class="sep">/</span>
            <span class="current">${meta.title}</span>
          </nav>

          <div class="proc-header">
            <h1>${meta.title}</h1>
            <div class="proc-meta">
              <span class="badge ${levelClass}">${meta.level}</span>
              <span class="meta-duration">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                ${meta.duration} minutes
              </span>
            ${tagsHtml}
            </div>
          </div>

          <article class="prose">
${html}
          </article>
${meta.author ? `
          <div class="proc-author">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            <span class="proc-author-label">Auteur</span>
            <span class="proc-author-sep">·</span>
            <span class="proc-author-name">${meta.author}</span>
          </div>` : ''}

          <div style="margin-top:48px;padding-top:32px;border-top:1px solid var(--color-border)">
            <a href="../${meta.category}/${meta.subcategory}.html" class="back-link" style="margin:0;padding:8px 16px;background-color:var(--color-bg-secondary);border-radius:8px">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Retour aux procédures
            </a>
          </div>
        </div>
${tocHtml}
      </div>
    </div>
  </main>

  <script src="../js/data.js"></script>
  <script src="../js/layout.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT_DIR, slug + '.html'), page);

  const patchResult = patchDataJs(slug, meta, tags, data.categories, data.procedures, fs.readFileSync(DATA_FILE, 'utf8'));
  // Refresh in-memory procedures so a batch run picks up freshly-added entries
  if (patchResult.patched) {
    data.procedures = loadDataJs().procedures;
  }

  return { slug, dataJs: patchResult.patched ? 'inserted' : patchResult.reason };
}

// ============ MAIN ============
function main() {
  const arg = process.argv[2];
  let files;

  if (arg) {
    const p = path.isAbsolute(arg) ? arg : path.resolve(process.cwd(), arg);
    if (!fs.existsSync(p)) {
      console.error(`File not found: ${p}`);
      process.exit(1);
    }
    files = [p];
  } else {
    if (!fs.existsSync(MD_DIR)) {
      console.error(`Source dir not found: ${MD_DIR}`);
      process.exit(1);
    }
    files = fs.readdirSync(MD_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => path.join(MD_DIR, f));
    if (files.length === 0) {
      console.log(`No .md files in ${MD_DIR}`);
      return;
    }
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const data = loadDataJs();
  let ok = 0, fail = 0;

  for (const f of files) {
    try {
      const res = convertOne(f, data);
      console.log(`✓ ${res.slug}.html  (data.js: ${res.dataJs})`);
      ok++;
    } catch (e) {
      console.error(`✗ ${path.basename(f)} — ${e.message}`);
      fail++;
    }
  }

  console.log(`\nDone. ${ok} ok, ${fail} failed.`);
  if (fail > 0) process.exit(1);
}

main();
