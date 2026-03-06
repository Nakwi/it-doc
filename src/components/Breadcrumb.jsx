export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <a
        href="/"
        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        Accueil
      </a>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[var(--color-text-secondary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {item.href ? (
            <a
              href={item.href}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-[var(--color-text-primary)] font-medium">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
