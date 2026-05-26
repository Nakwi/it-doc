// ============ THEME ============
(function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // Sidebar category expand/collapse
  document.querySelectorAll('.sidebar-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      const sub = btn.nextElementSibling;
      if (sub && sub.classList.contains('sidebar-sub')) {
        sub.classList.toggle('open');
      }
    });
  });

  // Auto-expand active sidebar category
  document.querySelectorAll('.sidebar-sub-item.active').forEach(item => {
    const sub = item.closest('.sidebar-sub');
    if (sub) {
      sub.classList.add('open');
      const cat = sub.previousElementSibling;
      if (cat && cat.classList.contains('sidebar-cat')) {
        cat.setAttribute('aria-expanded', 'true');
      }
    }
  });

  // ============ SEARCH ============
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  if (searchInput && searchResults && window.__PROCEDURES__) {
    const procedures = window.__PROCEDURES__;

    const render = (query) => {
      const q = query.trim().toLowerCase();
      if (!q) { searchResults.classList.remove('open'); return; }
      const matches = procedures.filter(p => {
        return p.title.toLowerCase().includes(q) ||
               (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
      }).slice(0, 8);

      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-empty">Aucun résultat</div>';
      } else {
        const base = document.body.dataset.base || '';
        searchResults.innerHTML = matches.map(p => `
          <a class="search-result-item" href="${base}procedure/${p.id}.html">
            <div class="search-result-title">${p.title}</div>
            <div class="search-result-meta">${p.categoryLabel} • ${p.subcategoryLabel} • ${p.duration} min</div>
          </a>`).join('');
      }
      searchResults.classList.add('open');
    };

    searchInput.addEventListener('input', e => render(e.target.value));
    searchInput.addEventListener('focus', e => {
      if (e.target.value) render(e.target.value);
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.search-wrap')) {
        searchResults.classList.remove('open');
      }
    });
  }

  // ============ COPY CODE BUTTONS ============
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.code-block');
      const code = block.querySelector('code');
      if (!code) return;
      const text = code.innerText;
      const ok = () => {
        const original = btn.innerHTML;
        btn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Copié !';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove('copied');
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok).catch(fallback);
      } else { fallback(); }
      function fallback() {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); ok(); } catch(e) {}
        document.body.removeChild(ta);
      }
    });
  });

  // ============ TOC SCROLL SPY ============
  const tocLinks = document.querySelectorAll('.toc-link');
  const headings = document.querySelectorAll('.prose h2[id], .prose h3[id]');
  if (tocLinks.length && headings.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.toc-link[data-id="${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -80% 0px', threshold: 0 });
    headings.forEach(h => observer.observe(h));
  }
});
