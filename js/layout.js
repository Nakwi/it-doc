// Injects header + sidebar into every page based on body data attributes
// Expects: <body data-base="" data-current-path="/linux">

(function buildLayout() {
  const base = document.body.dataset.base || '';
  const currentPath = document.body.dataset.currentPath || '';

  const categoryIcons = {
    'windows-server': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>',
    'linux': '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>',
    'reseau': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>',
    'securite': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
    'virtualisation': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>'
  };

  // ======== HEADER ========
  const headerHTML = `
    <header class="header">
      <div class="header-inner">
        <a href="${base}index.html" class="logo">
          <div class="logo-mark">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <span class="logo-text">IT-DOC</span>
        </a>

        <div class="search-wrap">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" class="search-input" placeholder="Rechercher une procédure..." />
          <div class="search-results"></div>
        </div>

        <nav class="nav-links">
          <a href="${base}index.html" class="nav-link">Accueil</a>
          <a href="${base}tags.html" class="nav-link">Tags</a>
          <a href="${base}a-propos.html" class="nav-link">À propos</a>
          <button class="theme-toggle" aria-label="Toggle theme">
            <svg class="icon-moon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            <svg class="icon-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </button>
        </nav>
      </div>
    </header>`;

  // ======== SIDEBAR ========
  // Compute procedure counts per category/subcategory
  const counts = {};
  (window.__PROCEDURES__ || []).forEach(p => {
    if (!counts[p.category]) counts[p.category] = {};
    counts[p.category][p.subcategory] = (counts[p.category][p.subcategory] || 0) + 1;
  });

  const sidebarHTML = `
    <aside class="sidebar">
      <div class="sidebar-inner">
        <h2 class="sidebar-title">Documentation</h2>
        <nav class="sidebar-nav">
          ${(window.__CATEGORIES__ || [])
            .filter(c => counts[c.id])
            .map(c => {
              const totalC = Object.values(counts[c.id]).reduce((a,b) => a+b, 0);
              const isActiveCat = currentPath.startsWith('/' + c.id);
              const subs = c.subcategories.filter(s => counts[c.id][s.id]);
              return `
              <div>
                <button class="sidebar-cat ${isActiveCat ? 'active' : ''}" aria-expanded="${isActiveCat ? 'true' : 'false'}">
                  <span class="sidebar-cat-left">
                    <span style="color: ${c.color}">${categoryIcons[c.id] || ''}</span>
                    <span>${c.label}</span>
                  </span>
                  <span class="sidebar-cat-right">
                    <span>${totalC}</span>
                    <svg class="chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </button>
                <div class="sidebar-sub ${isActiveCat ? 'open' : ''}">
                  ${subs.map(s => {
                    const isActiveSub = currentPath === `/${c.id}/${s.id}`;
                    return `<a href="${base}${c.id}/${s.id}.html" class="sidebar-sub-item ${isActiveSub ? 'active' : ''}">
                      <span>${s.label}</span>
                      <span class="count">${counts[c.id][s.id]}</span>
                    </a>`;
                  }).join('')}
                </div>
              </div>`;
            }).join('')}
        </nav>
      </div>
      <div class="sidebar-footer">IT-DOC v1.0.0</div>
    </aside>`;

  // Inject
  document.body.insertAdjacentHTML('afterbegin', headerHTML);
  const layout = document.createElement('div');
  layout.className = 'layout';
  const noSidebar = document.body.dataset.noSidebar === '1';
  layout.innerHTML = (noSidebar ? '' : sidebarHTML) + '<main class="main"></main>';
  // Move existing main content into the layout
  const existingMain = document.querySelector('main[data-content]');
  if (existingMain) {
    layout.querySelector('.main').innerHTML = existingMain.innerHTML;
    existingMain.remove();
  }
  document.body.appendChild(layout);
})();
