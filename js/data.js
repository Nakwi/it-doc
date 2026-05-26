// Data shared across all pages (procedures + categories)
window.__CATEGORIES__ = [
  {
    id: 'windows-server',
    label: 'Windows Server',
    color: '#0078D4',
    emoji: '🪟',
    description: 'Active Directory, GPO, DNS, DHCP, serveurs de fichiers',
    subcategories: [
      { id: 'active-directory', label: 'Active Directory' },
      { id: 'gpo', label: 'GPO' },
      { id: 'dns', label: 'Serveur DNS' },
      { id: 'dhcp', label: 'Serveur DHCP' },
      { id: 'serveur-fichiers', label: 'Serveur de fichiers' },
      { id: 'bureau-a-distance', label: 'Bureau à distance' }
    ]
  },
  {
    id: 'linux',
    label: 'Linux',
    color: '#E95420',
    emoji: '🐧',
    description: 'Administration système, scripting bash, services réseau, outils IT',
    subcategories: [
      { id: 'administration-systeme', label: 'Administration système' },
      { id: 'scripting-bash', label: 'Scripting Bash' },
      { id: 'services-reseau', label: 'Services réseau' },
      { id: 'outils-it', label: 'Outils IT' }
    ]
  },
  {
    id: 'reseau',
    label: 'Réseau',
    color: '#00B4D8',
    emoji: '🌐',
    description: 'Configuration routeurs, VLANs, protocoles TCP/IP',
    subcategories: [
      { id: 'tcp-ip', label: 'TCP/IP' },
      { id: 'surveillance-reseau', label: 'Surveillance réseau' }
    ]
  },
  {
    id: 'securite',
    label: 'Sécurité',
    color: '#E63946',
    emoji: '🔒',
    description: 'Pare-feu, VPN, authentification, chiffrement',
    subcategories: [
      { id: 'pare-feu', label: 'Pare-feu' },
      { id: 'vpn', label: 'VPN' },
      { id: 'authentification', label: 'Authentification' },
      { id: 'chiffrement', label: 'Chiffrement' }
    ]
  },
  {
    id: 'virtualisation',
    label: 'Virtualisation',
    color: '#7B2FBE',
    emoji: '💻',
    description: 'VMware, Hyper-V, Docker, Kubernetes, WSL',
    subcategories: [
      { id: 'vmware', label: 'VMware' },
      { id: 'hyper-v', label: 'Hyper-V' },
      { id: 'docker', label: 'Docker' },
      { id: 'kubernetes', label: 'Kubernetes' },
      { id: 'wsl', label: 'WSL' },
      { id: 'proxmox', label: 'Proxmox' }
    ]
  }
];

window.__PROCEDURES__ = [
  {
    id: 'deploiement-windows11-proxmox',
    title: "Déploiement d'un poste client Windows 11 sur Proxmox VE",
    category: 'virtualisation', categoryLabel: 'Virtualisation',
    subcategory: 'proxmox', subcategoryLabel: 'Proxmox',
    level: 'Débutant', duration: 30,
    tags: ['Windows 11', 'Proxmox', 'VM', 'OOBE', 'TPM'],
    cover: 'images/win11/windows11_cover.png'
  },
  {
    id: 'installation-debian13-vmware',
    title: 'Installer Debian 13 sur VMware Workstation Pro',
    category: 'virtualisation', categoryLabel: 'Virtualisation',
    subcategory: 'vmware', subcategoryLabel: 'VMware',
    level: 'Débutant', duration: 30,
    tags: ['Debian', 'VMware', 'Installation', 'VM'],
    cover: 'images/debian13/debianvmware_cover.png'
  },
  {
    id: 'installation-glpi-debian',
    title: 'Installer GLPI sur Debian',
    category: 'linux', categoryLabel: 'Linux',
    subcategory: 'outils-it', subcategoryLabel: 'Outils IT',
    level: 'Intermédiaire', duration: 45,
    tags: ['GLPI', 'Debian', 'Apache', 'MariaDB', 'PHP'],
    cover: 'images/glpi/GLPI_cover.png'
  },
  {
    id: 'installation-pfsense-vmware',
    title: 'Installation et configuration initiale de pfSense CE sur VMware',
    category: 'securite', categoryLabel: 'Sécurité',
    subcategory: 'pare-feu', subcategoryLabel: 'Pare-feu',
    level: 'Débutant', duration: 60,
    tags: ['pfSense', 'Firewall', 'VMware', 'Pare-feu', 'Réseau'],
    cover: 'images/pfsense/pfsense_cover.png'
  },
  {
    id: 'installation-rds-windows-server',
    title: 'Installation et configuration des Services Bureau à distance (RDS)',
    category: 'windows-server', categoryLabel: 'Windows Server',
    subcategory: 'bureau-a-distance', subcategoryLabel: 'Bureau à distance',
    level: 'Intermédiaire', duration: 90,
    tags: ['RDS', 'RemoteApp', 'Windows Server', 'Bureau à distance', 'MSIX'],
    cover: 'images/rds/rds_cover.png'
  },
  {
    id: 'installation-windows-server-2025-vmware-fusion',
    title: 'Installer Windows Server 2025 sur VMware Fusion (macOS)',
    category: 'virtualisation', categoryLabel: 'Virtualisation',
    subcategory: 'vmware', subcategoryLabel: 'VMware',
    level: 'Intermédiaire', duration: 45,
    tags: ['Windows Server 2025', 'VMware Fusion', 'macOS', 'Installation', 'VM'],
    cover: 'images/winserver2025/winserver2025_cover.png'
  },
  {
    id: 'installation-wsl',
    title: 'Installer et configurer WSL (Windows Subsystem for Linux)',
    category: 'virtualisation', categoryLabel: 'Virtualisation',
    subcategory: 'wsl', subcategoryLabel: 'WSL',
    level: 'Débutant', duration: 20,
    tags: ['WSL', 'Windows', 'Linux', 'Ubuntu', 'VS Code'],
    cover: 'images/wsl/wsl_cover.png'
  },
  {
    id: 'technitium-dns-dhcp',
    title: 'Installer un serveur DNS & DHCP avec Technitium',
    category: 'linux', categoryLabel: 'Linux',
    subcategory: 'services-reseau', subcategoryLabel: 'Services réseau',
    level: 'Intermédiaire', duration: 45,
    tags: ['Technitium', 'DNS', 'DHCP', 'Debian'],
    cover: 'images/technitium/technitium_cover.png'
  }
];
