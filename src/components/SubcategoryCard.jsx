export default function SubcategoryCard({ subcategory, categoryId, color }) {
  return (
    <a
      href={`/${categoryId}/${subcategory.id}`}
      className="group flex items-center justify-between bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] p-5 card-hover"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <svg
            className="w-5 h-5"
            style={{ color }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:underline">
            {subcategory.label}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            {subcategory.procedures.length} procédure{subcategory.procedures.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <svg
        className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}
