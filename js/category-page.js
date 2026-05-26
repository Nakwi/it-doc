// Renders a category page using window.__CATEGORY_ID__
(function renderCategory() {
  const id = window.__CATEGORY_ID__;
  if (!id) return;
  const cat = window.__CATEGORIES__.find(c => c.id === id);
  if (!cat) return;
  const procs = window.__PROCEDURES__.filter(p => p.category === id);
  const counts = {};
  procs.forEach(p => { counts[p.subcategory] = (counts[p.subcategory] || 0) + 1; });
  const total = procs.length;

  document.getElementById('cat-title').textContent = cat.label;
  document.getElementById('cat-title').style.color = cat.color;
  document.getElementById('cat-desc').textContent = cat.description;
  document.getElementById('cat-meta').innerHTML =
    `<span>${cat.subcategories.length} sous-catégories</span><span>•</span><span>${total} procédure${total > 1 ? 's' : ''}</span>`;

  document.getElementById('subcat-list').innerHTML = cat.subcategories.map(s => {
    const count = counts[s.id] || 0;
    const hasContent = count > 0;
    const href = hasContent ? `${cat.id}/${s.id}.html` : '#';
    return `
      <a href="${href}" class="subcat-link" ${hasContent ? '' : 'style="opacity:0.5; cursor:not-allowed" onclick="event.preventDefault()"'}>
        <div class="subcat-left">
          <div class="subcat-icon" style="background-color: ${cat.color}26">
            <svg style="color: ${cat.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
          </div>
          <div>
            <div class="subcat-name">${s.label}</div>
            <div class="subcat-count">${count} procédure${count > 1 ? 's' : ''}</div>
          </div>
        </div>
        <svg class="subcat-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>`;
  }).join('');

  document.title = cat.label + ' | IT-DOC';
})();
