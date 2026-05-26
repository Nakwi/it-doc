// Renders a subcategory page using window.__CATEGORY_ID__ + window.__SUBCATEGORY_ID__
(function renderSubcategory() {
  const catId = window.__CATEGORY_ID__;
  const subId = window.__SUBCATEGORY_ID__;
  if (!catId || !subId) return;
  const cat = window.__CATEGORIES__.find(c => c.id === catId);
  const sub = cat?.subcategories.find(s => s.id === subId);
  if (!cat || !sub) return;
  const procs = window.__PROCEDURES__.filter(p => p.category === catId && p.subcategory === subId);

  document.title = `${sub.label} - ${cat.label} | IT-DOC`;
  document.getElementById('crumb-cat').textContent = cat.label;
  document.getElementById('crumb-cat').setAttribute('href', `../${cat.id}.html`);
  document.getElementById('crumb-sub').textContent = sub.label;
  document.getElementById('sub-title').textContent = sub.label;
  document.getElementById('sub-meta').textContent =
    `${procs.length} procédure${procs.length > 1 ? 's' : ''} disponible${procs.length > 1 ? 's' : ''}`;

  if (procs.length === 0) {
    document.getElementById('proc-grid').innerHTML =
      `<div style="grid-column:1/-1;text-align:center;padding:48px;background-color:var(--color-bg-secondary);border-radius:12px;">
        <p style="color:var(--color-text-secondary)">Aucune procédure disponible pour le moment</p>
      </div>`;
    return;
  }

  document.getElementById('proc-grid').innerHTML = procs.map(p => `
    <a href="../procedure/${p.id}.html" class="proc-card">
      <div class="proc-card-cover">
        ${p.cover
          ? `<img src="../${p.cover}" alt="${p.title}" />`
          : `<div class="proc-card-cover-fallback">${cat.emoji}</div>`}
      </div>
      <div class="proc-card-body">
        <h3 class="proc-card-title">${p.title}</h3>
        <div class="proc-card-footer" style="margin-top:12px">
          <span class="badge badge-${p.level.toLowerCase().replace(/é/g, 'e')}">${p.level}</span>
          <span class="proc-card-duration">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            ${p.duration} min
          </span>
        </div>
        ${p.tags && p.tags.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:12px">
          ${p.tags.slice(0, 2).map(t => `<span style="padding:2px 8px;font-size:0.7rem;background-color:var(--color-bg-tertiary);color:var(--color-text-secondary);border-radius:4px">${t}</span>`).join('')}
        </div>` : ''}
      </div>
    </a>`).join('');
})();
