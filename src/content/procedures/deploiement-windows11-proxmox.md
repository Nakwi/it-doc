---
title: "Déploiement d'un poste client Windows 11 sur Proxmox VE"
category: "virtualisation"
subcategory: "proxmox"
level: "Débutant"
duration: 30
tags: ["Windows 11", "Proxmox", "VM", "OOBE", "TPM"]
cover: "/images/win11/windows11_cover.png"
---

## Sommaire

1. [Création de la VM sur Proxmox](#1-création-de-la-vm-sur-proxmox)
2. [Installation du système](#2-installation-du-système)
3. [Configuration personnalisée (OOBE & Bypass)](#3-configuration-personnalisée-oobe--bypass)
4. [Finalisation](#4-finalisation)

## 1. Création de la VM sur Proxmox

### Paramètres généraux

- **Nœud :** Sélectionnez votre serveur (ex : `nakserv`).
- **ID / Nom :** Attribuez l'ID `100` et le nom `IT-DOC-Win11C`.

![Paramètres généraux](/images/win11/16.png)

### Système d'exploitation

- **ISO :** Sélectionnez l'image `Win11_25H2_French` stockée sur votre serveur.
- **Type/Version :** Choisissez `Microsoft Windows` et la version `11/2022/2025`.

![Système d'exploitation](/images/win11/17.png)

### Configuration système (prérequis Windows 11)

- **BIOS/Machine :** Utilisez `OVMF (UEFI)` et le chipset `q35`.
- **Sécurité :** Cochez l'ajout d'un disque EFI et d'un module **TPM v2.0**.

![Configuration système](/images/win11/18.png)

### Ressources matérielles

Allouez **60 Go** sur le stockage `local-lvm`.

![Disque 60 Go](/images/win11/19.png)

---
Configurez **2 cœurs** CPU.

![CPU 2 cœurs](/images/win11/20.png)

---
Allouez **4096 MiB** (4 Go) de RAM et désactivez le *ballooning*.

![RAM 4 Go](/images/win11/21.png)

---
Laissez les paramètres réseau par défaut (Bridge `vmbr0`).

![Réseau](/images/win11/22.png)

## 2. Installation du système

Lancez la VM et appuyez sur la barre espace pour démarrer l'installation.

Validez le **Français** et le clavier **AZERTY**.

![Langue et clavier](/images/win11/24.png)

---
Si vous avez une clé produit renseignez-la, sinon cliquez sur **Je n'ai pas de clé produit**.

![Clé produit](/images/win11/4.png)

---
Sélectionnez **Windows 11 Professionnel** pour plus de fonctionnalités.

![Version Windows 11 Pro](/images/win11/5.png)

---
Acceptez les conditions d'utilisation.

![Conditions](/images/win11/6.png)

---
Sélectionnez l'espace non alloué de 60 Go pour le partitionnement.

![Partitionnement](/images/win11/7.png)

---
Cliquez sur **Installer** et attendez la fin de la copie des fichiers.

## 3. Configuration personnalisée (OOBE & Bypass)

### Configuration classique

Sélectionnez votre langue.

![Langue](/images/win11/10.png)

---
Puis le clavier.

![Clavier](/images/win11/11.png)

---
Puis le type d'utilisation.

![Type d'utilisation](/images/win11/12.png)

### Contournement du compte Microsoft

À l'écran de configuration du pays ou du réseau, ouvrez le terminal avec **Shift + F10** (ou Tab + F10) et tapez :

```cmd
oobe\bypassnro
```

![Bypass NRO](/images/win11/25.png)

### Création du compte local

Windows va redémarrer. Une fois le boot terminé, vous repasserez par le choix de la langue et du clavier, puis vous arriverez sur une page demandant un nom pour l'appareil.

![Nom de l'appareil](/images/win11/26.png)

---
Refusez systématiquement les options de collecte de données pour plus de confidentialité.

## 4. Finalisation

Patientez durant la préparation finale du bureau.

![Préparation bureau](/images/win11/27.png)

![Chargement final](/images/win11/28.png)

---
Vous êtes connecté sur votre machine Windows 11.

![Bureau Windows 11](/images/win11/29.png)
