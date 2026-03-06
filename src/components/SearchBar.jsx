import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import docsData from '../data/docs.json';

// Flatten all procedures for search
const getAllProcedures = () => {
  const procedures = [];
  docsData.categories.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subcategory.procedures.forEach(procedure => {
        procedures.push({
          ...procedure,
          categoryId: category.id,
          categoryLabel: category.label,
          subcategoryId: subcategory.id,
          subcategoryLabel: subcategory.label,
          color: category.color
        });
      });
    });
  });
  return procedures;
};

const fuse = new Fuse(getAllProcedures(), {
  keys: ['title', 'tags', 'categoryLabel', 'subcategoryLabel'],
  threshold: 0.3,
  includeScore: true
});

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (query.length > 1) {
      const searchResults = fuse.search(query).slice(0, 8);
      setResults(searchResults.map(r => r.item));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLevelBadgeClasses = (level) => {
    switch (level) {
      case 'Débutant':
        return 'bg-[#DCFCE7] text-[#16A34A]';
      case 'Intermédiaire':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'Avancé':
        return 'bg-[#FEE2E2] text-[#DC2626]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher une procédure..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#0078D4]/50 focus:border-[#0078D4] transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden z-50">
          <div className="max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <a
                key={`${result.categoryId}-${result.subcategoryId}-${result.id}`}
                href={`/${result.categoryId}/${result.subcategoryId}/${result.id}`}
                className="flex items-start gap-3 p-3 hover:bg-[var(--color-bg-secondary)] transition-colors border-b border-[var(--color-border)] last:border-b-0"
              >
                <div
                  className="w-1 h-12 rounded-full shrink-0"
                  style={{ backgroundColor: result.color }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {result.title}
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {result.categoryLabel} &gt; {result.subcategoryLabel}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getLevelBadgeClasses(result.level)}`}>
                      {result.level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {result.duration} min
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.length > 1 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl shadow-xl p-4 text-center z-50">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Aucun résultat pour "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
