import LevelBadge from './LevelBadge';

export default function ProcedureCard({ procedure, categoryId, subcategoryId }) {
  return (
    <a
      href={`/${categoryId}/${subcategoryId}/${procedure.id}`}
      className="group block bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] overflow-hidden card-hover"
    >
      {/* Cover Image */}
      <div className="aspect-video bg-[var(--color-bg-tertiary)] relative overflow-hidden">
        {procedure.cover ? (
          <img
            src={procedure.cover}
            alt={procedure.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-[var(--color-text-secondary)] opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:underline">
          {procedure.title}
        </h3>

        <div className="flex items-center gap-3 mt-3">
          <LevelBadge level={procedure.level} />
          <span className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {procedure.duration} min
          </span>
        </div>

        {procedure.tags && procedure.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {procedure.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
