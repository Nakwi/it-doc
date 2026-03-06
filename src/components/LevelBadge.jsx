export default function LevelBadge({ level }) {
  const getLevelStyles = () => {
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
    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getLevelStyles()}`}>
      {level}
    </span>
  );
}
