const categoryEmojis = {
  'windows-server': '🪟',
  'linux': '🐧',
  'reseau': '🌐',
  'securite': '🔒',
  'virtualisation': '💻'
};

export default function CategoryCard({ category }) {
  const totalProcedures = category.subcategories.reduce(
    (sum, sub) => sum + sub.procedures.length,
    0
  );

  return (
    <a
      href={`/${category.id}`}
      className="group block bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] p-5 card-hover text-center"
    >
      <div
        className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-3xl mb-4"
        style={{ backgroundColor: `${category.color}15` }}
      >
        {categoryEmojis[category.id]}
      </div>
      <h3
        className="font-display font-semibold text-base text-[var(--color-text-primary)] group-hover:underline mb-2"
        style={{ color: category.color }}
      >
        {category.label}
      </h3>
      <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-3">
        {category.description}
      </p>
      <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)]">
        <span>{totalProcedures} procédures</span>
      </div>
    </a>
  );
}
