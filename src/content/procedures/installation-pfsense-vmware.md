---
title: "Installation et configuration initiale de pfSense CE sur VMware"
category: "securite"
subcategory: "pare-feu"
level: "Débutant"
duration: 60
tags: ["pfSense", "Firewall", "VMware", "Pare-feu", "Réseau"]
cover: "/images/pfsense/pfsense_cover.png"
---

## Sommaire

1. [Introduction à pfSense et au rôle du Firewall](#1-introduction-à-pfsense-et-au-rôle-du-firewall)
2. [Prérequis pour l'installation](#2-prérequis-pour-linstallation)
3. [Création de la machine virtuelle VMware](#3-création-de-la-machine-virtuelle-vmware)
4. [Installation de pfSense CE](#4-installation-de-pfsense-ce)
5. [Post-installation](#5-post-installation)
6. [Accès à l'interface web pfSense](#6-accès-à-linterface-web-pfsense)
7. [Bonnes pratiques pour débuter](#7-bonnes-pratiques-pour-débuter)

## 1. Introduction à pfSense et au rôle du Firewall

### Qu'est-ce que pfSense CE ?

pfSense CE (Community Edition) est un logiciel *firewall* (pare-feu) basé sur FreeBSD. Il est gratuit, open source et extrêmement complet. Il transforme un ordinateur (physique ou virtuel) en un routeur/firewall professionnel.

### Le rôle d'un Firewall

Un *firewall* agit comme un **gardien** entre votre réseau interne et un réseau externe non sûr comme Internet.

| Rôle | Explication |
| :---- | :---- |
| **Filtrage** | Il examine chaque paquet de données entrant et sortant. |
| **Autorisation / Blocage** | Il décide, selon des règles que vous définissez, si le paquet doit passer ou être bloqué. |
| **Protection** | Il empêche les intrusions et les accès non sollicités venant de l'extérieur. |

### Pourquoi utiliser pfSense en formation ?

pfSense est idéal pour un laboratoire virtuel car il est **complet** (VPN, filtrage avancé, DHCP...), **pédagogique** (interface logique pour comprendre l'architecture réseau) et **standard du secteur** (très proche des solutions utilisées en entreprise).

## 2. Prérequis pour l'installation

### Logiciel et fichiers

- **VMware Workstation Pro** : une version récente est recommandée.
- **Image ISO pfSense CE** : à télécharger depuis le site officiel de Netgate.

### Configuration minimale de la VM

| Composant | Recommandation | Détails |
| :---- | :---- | :---- |
| **Interfaces réseau** | 2 minimum | 1 WAN (vers Internet simulé) et 1 LAN (réseau interne). Indispensable pour un firewall. |
| **RAM** | 2 Go | 512 Mo est le minimum, 2 Go assure un bon confort. |
| **CPU** | 2 cœurs | Un seul cœur est suffisant. |
| **Disque virtuel** | 20 Go | Largement suffisant en SCSI. |

> Sans au moins deux cartes réseau, pfSense ne peut pas fonctionner comme firewall — il n'aurait pas d'entrée (WAN) et de sortie (LAN). Vous pouvez cependant installer avec une seule carte et en ajouter une ensuite.

## 3. Création de la machine virtuelle VMware

### 3.1 Création d'une nouvelle VM

Lancez VMware Workstation Pro.

![Lancement VMware](/images/pfsense/image2.png)

---
Cliquez sur **File** > **New Virtual Machine...** puis sélectionnez **Custom (advanced)** et cliquez sur **Next**.

![Nouvelle VM](/images/pfsense/image3.png)

![Custom advanced](/images/pfsense/image4.png)

### 3.2 Choix du type de système

Dans la fenêtre **Guest Operating System Installation**, choisissez **Use ISO image file** et indiquez votre ISO pfSense CE.

![Sélection ISO](/images/pfsense/image5.png)

---
Cliquez sur **Next**, puis attribuez un nom à la VM.

![Attribution du nom](/images/pfsense/image6.png)

![Nom de la VM](/images/pfsense/image7.png)

---
Pour le nombre de processeurs, nous mettons 2 pour plus d'aisance, puis 2 Go de RAM.

![Configuration CPU](/images/pfsense/image8.png)

### 3.3 Configuration réseau

C'est l'étape la plus importante. Nous allons créer deux cartes réseau virtuelles : une pour le WAN et une pour le LAN.

![Configuration réseau](/images/pfsense/image9.png)

| Adaptateur | Rôle | Type de réseau VMware recommandé |
| :---- | :---- | :---- |
| Carte 1 | **WAN** | NAT (accès Internet via la machine hôte) |
| Carte 2 | **LAN** | Host-only (réseau interne isolé) |

**Adaptateur WAN** : sélectionnez **NAT**. Cela permet à pfSense d'accéder à Internet via votre machine hôte sans se soucier des adresses IP réelles.

**Adaptateur LAN** : une fois la première carte créée, allez dans les paramètres de la VM (**Customize Hardware**), cliquez sur **Add** > **Network Adapter** et sélectionnez **Host-only**. Ce réseau privé et isolé est celui auquel vous connecterez vos autres VMs clientes.

### 3.4 Configuration du disque

Contrôleur : **LSI Logic**

![Contrôleur LSI Logic](/images/pfsense/image10.png)

---
Type de disque : **SCSI**

![Type SCSI](/images/pfsense/image11.png)

---
Créez un nouveau disque virtuel.

![Créer disque](/images/pfsense/image12.png)

---
Taille du disque : **20 Go**. Si vous comptez analyser des logs sur pfSense, prévoyez plus.

![Taille 20 Go](/images/pfsense/image13.png)

---
Laissez le lieu de stockage par défaut.

![Stockage par défaut](/images/pfsense/image14.png)

---
Récapitulatif de la configuration avant de créer la VM.

![Récapitulatif VM](/images/pfsense/image15.png)

## 4. Installation de pfSense CE

### 4.1 Démarrage de la VM

Lorsque la VM démarre, un compte à rebours de 10 secondes s'affiche. Ne touchez à rien et laissez-le atteindre zéro (ou appuyez sur `Entrée`). Cela lancera le démarrage par défaut.

![Écran de boot](/images/pfsense/image16.png)

### 4.2 Lancement de l'installateur

Après le chargement des composants, vous arrivez à l'écran de bienvenue avec la licence d'utilisation.

![Écran de bienvenue](/images/pfsense/image17.png)

---
Sélectionnez **Accept** puis appuyez sur **Entrée**, puis choisissez **Install** pour lancer l'installation complète.

![Accept licence](/images/pfsense/image18.png)

### 4.3 Paramétrage de la carte réseau

![Sélection interface réseau](/images/pfsense/image19.png)

---
Validez le choix de l'interface pour le WAN.

![Validation WAN](/images/pfsense/image20.png)

---
Sélectionnez l'interface WAN pour l'installation de pfSense.

![Interface WAN](/images/pfsense/image21.png)

---
Puis lancez l'installation.

![Lancement installation](/images/pfsense/image22.png)

![Installation en cours](/images/pfsense/image23.png)

### 4.4 Partitionnement

L'installateur va partitionner le disque. Laissez les options par défaut — pour les débutants, c'est la solution la plus simple.

![Partitionnement](/images/pfsense/image24.png)

![Options partitionnement](/images/pfsense/image25.png)

### 4.5 Sélection du disque virtuel

pfSense détecte le disque virtuel que vous avez créé (généralement nommé `ada0`). L'avertissement vous informe que **toutes les données** présentes seront effacées.

![Sélection du disque](/images/pfsense/image26.png)

---
Confirmez l'avertissement et cliquez sur **OK**. Puisque c'est un disque virtuel vide, il n'y a aucun risque.

![Avertissement effacement](/images/pfsense/image27.png)

### 4.6 Choix de la version et fin d'installation

Choisissez la dernière version **Stable**.

![Choix version stable](/images/pfsense/image28.png)

---
Une fois les fichiers copiés, sélectionnez **Reboot** pour redémarrer sur le système installé.

![Fin d'installation](/images/pfsense/image29.png)

## 5. Post-installation

### 5.1 Redémarrage et retrait de l'ISO

Avant le redémarrage, éjectez l'ISO d'installation : dans VMware, allez dans **VM** > **Settings** > **CD/DVD (SATA)** et décochez **Connect at power on**. Sélectionnez ensuite **Reboot** dans la console pfSense.

### 5.2 Première configuration console

Après le redémarrage, pfSense affiche l'attribution des interfaces réseau.

![Console pfSense](/images/pfsense/image30.png)

Le système affiche un résumé :

- **WAN** : adresse IP obtenue via DHCP (souvent 192.168.x.x en NAT VMware).
- **LAN** : l'adresse IP par défaut est **192.168.1.1** — c'est la *gateway* de votre réseau interne. Elle sera configurable via l'interface web.

## 6. Accès à l'interface web pfSense

### 6.1 Adresse IP LAN par défaut

L'adresse d'administration de pfSense est : **`http://192.168.1.1`**

### 6.2 Accès via navigateur

Ouvrez un navigateur sur votre machine hôte (ou une VM connectée au réseau Host-only/LAN) et tapez **`http://192.168.1.1`**.

![Page de connexion pfSense](/images/pfsense/image31.png)

| Connexion par défaut | Valeur |
| :---- | :---- |
| **Nom d'utilisateur** | `admin` |
| **Mot de passe** | `pfsense` |

### 6.3 Assistant de configuration initiale (Wizard)

La première fois, pfSense lance un assistant (*Setup Wizard*). Suivez les étapes :

**Welcome / Next** — démarrez l'assistant.

![Setup Wizard](/images/pfsense/image32.png)

---
**General Information** :

- **Hostname** : `pfSense-LAB` (par exemple)
- **Domain** : `lab.local` (pour votre réseau interne)
- **DNS Servers** : laissez par défaut ou renseignez `8.8.8.8` et `8.8.4.4`

![Informations générales](/images/pfsense/image33.png)

---
**TimeZone** : sélectionnez votre fuseau horaire.

![Fuseau horaire](/images/pfsense/image34.png)

---
**WAN Configuration** : laissez **DHCP** — le réseau VMware (NAT) fournira l'IP automatiquement.

![Configuration WAN](/images/pfsense/image35.png)

---
Décochez les 2 cases suivantes, sinon vous ne pourrez plus accéder à l'interface web via le WAN.

![Cases à décocher](/images/pfsense/image36.png)

---
**Admin Password** : changez le mot de passe par défaut. Cliquez ensuite sur **Reload**.

![Changement mot de passe](/images/pfsense/image37.png)

## 7. Bonnes pratiques pour débuter

### Changer le mot de passe admin

C'est la première chose à faire. Le mot de passe par défaut (`pfsense`) est un risque de sécurité majeur. Si l'assistant ne vous l'a pas demandé, allez dans **System** > **User Manager**.

### Vérifier l'accès Internet

Depuis la console pfSense (Menu 9 — **Ping utility**), vérifiez que vous pouvez pinguer une adresse externe (`google.com`). Depuis un PC client connecté au réseau LAN, vérifiez qu'il obtient une IP via DHCP et qu'il accède à Internet.

### Sauvegarder la configuration

Dès que vous avez une configuration fonctionnelle, faites une sauvegarde : **Diagnostics** > **Backup / Restore** > téléchargez le fichier XML sur votre machine hôte.

> Sauvegardez après chaque grande étape. Cela vous évitera de tout recommencer en cas de fausse manipulation.
