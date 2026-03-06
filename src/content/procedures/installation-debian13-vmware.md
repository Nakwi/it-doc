---
title: "Installer Debian 13 sur VMware Workstation Pro"
category: "virtualisation"
subcategory: "vmware"
level: "Débutant"
duration: 30
tags: ["Debian", "VMware", "Installation", "VM"]
cover: "/images/debian13/debian-01.png"
---

## Sommaire

1. [Prérequis](#prérequis)
2. [Création de la machine virtuelle](#1-création-de-la-machine-virtuelle)
3. [Installation Debian](#2-installation-debian)
4. [Comptes utilisateurs](#3-comptes-utilisateurs)
5. [Partitionnement](#4-partitionnement)
6. [Paquets et logiciels](#5-paquets-et-logiciels)
7. [GRUB](#6-grub)
8. [Fin](#7-fin)

## Prérequis

- VMware Workstation Pro
- Un ISO Debian 13

## 1. Création de la machine virtuelle

Ouvrir VMware Workstation Pro et créer une nouvelle machine virtuelle.

![Création VM](</images/debian13/debian-01.png>)

Mode : **Personnalisée (avancée)**

![Mode personnalisé](</images/debian13/debian-02.png>)

Compatibilité : **Workstation 25H2**

![Compatibilité](</images/debian13/debian-03.png>)

ISO : **debian-13.x-amd64-netinst.iso**

![Sélection ISO](</images/debian13/debian-04.png>)

Nom : **Debian 13**

![Nom de la VM](</images/debian13/debian-05.png>)

CPU : **2 processeurs / 1 coeur**

![Configuration CPU](</images/debian13/debian-06.png>)

RAM : **2 Go**

![Configuration RAM](</images/debian13/debian-07.png>)

Réseau : **NAT**

![Configuration réseau](</images/debian13/debian-08.png>)

Contrôleur : **LSI Logic**

![Contrôleur](</images/debian13/debian-09.png>)

Type de disque : **SCSI**

![Type de disque](</images/debian13/debian-10.png>)

Créer un disque virtuel

![Créer disque](</images/debian13/debian-11.png>)

Disque : **SCSI – 20 Go – divisé en plusieurs fichiers**

![Taille disque](</images/debian13/debian-12.png>)

Cliquez sur Suivant

![Suivant](</images/debian13/debian-13.png>)

Vous pouvez placer votre VM où vous souhaitez, dans notre cas on laisse par défaut.

![Emplacement VM](</images/debian13/debian-14.png>)

## 2. Installation Debian

Démarrer la VM et choisir **Graphical install**

![Graphical install](</images/debian13/debian-15.png>)

Langue : **English**

![Langue](</images/debian13/debian-16.png>)

Pays : **United States**

![Pays](</images/debian13/debian-17.png>)

Clavier : **French**

![Clavier](</images/debian13/debian-18.png>)

Hostname : **debian**

![Hostname](</images/debian13/debian-19.png>)

Domaine : laisser vide

![Domaine](</images/debian13/debian-20.png>)

## 3. Comptes utilisateurs

Mot de passe root : définir un mot de passe sécurisé

![Mot de passe root](</images/debian13/debian-21.png>)

Nom complet utilisateur : **dev**

![Nom utilisateur](</images/debian13/debian-22.png>)

Identifiant utilisateur : **dev**

![Identifiant](</images/debian13/debian-23.png>)

Mot de passe utilisateur : définir

![Mot de passe user](</images/debian13/debian-24.png>)

Fuseau horaire du système

![Fuseau horaire](</images/debian13/debian-25.png>)

## 4. Partitionnement

Sélectionnez **Guided – use entire disk**

![Partitionnement guidé](</images/debian13/debian-26.png>)

Cliquez sur Continue

![Continue](</images/debian13/debian-27.png>)

Sélectionnez **All files in one partition**

![Une seule partition](</images/debian13/debian-28.png>)

Cliquez sur Continue

![Continue](</images/debian13/debian-29.png>)

Confirmez l'écriture sur le disque

![Confirmation](</images/debian13/debian-30.png>)

## 5. Paquets et logiciels

Cliquez sur Continue

![Paquets 1](</images/debian13/debian-31.png>)

Cliquez sur Continue

![Paquets 2](</images/debian13/debian-32.png>)

Miroir : **deb.debian.org**

![Miroir](</images/debian13/debian-33.png>)

Pas de proxy

![Proxy](</images/debian13/debian-34.png>)

Popularity contest : **No**

![Popularity](</images/debian13/debian-35.png>)

Sélection : **GNOME, SSH server, standard utilities**

![Sélection logiciels](</images/debian13/debian-36.png>)

> Pour une utilisation exclusivement serveur, il est recommandé de décocher les options "Debian desktop environment" et "GNOME", afin d'installer un système sans interface graphique, fonctionnant uniquement en ligne de commande (CLI), plus adapté et plus léger pour un usage serveur.

## 6. GRUB

Installer GRUB : **Yes**

![GRUB](</images/debian13/debian-37.png>)

Disque : **/dev/sda**

![Disque GRUB](</images/debian13/debian-38.png>)

## 7. Fin

Redémarrez la machine

![Redémarrage](</images/debian13/debian-39.png>)

Bienvenue sur le bureau GNOME de Debian 13 !

![Bureau GNOME](</images/debian13/debian-41.png>)
