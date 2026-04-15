---
title: "Installation et configuration des Services Bureau à distance (RDS)"
category: "windows-server"
subcategory: "bureau-a-distance"
level: "Intermédiaire"
duration: 90
tags: ["RDS", "RemoteApp", "Windows Server", "Bureau à distance", "MSIX"]
cover: "/images/rds/rds_cover.png"
---

## Sommaire

1. [Prérequis](#1-prérequis)
2. [Installation des services Bureau à distance](#2-installation-des-services-bureau-à-distance)
3. [Configuration de la Passerelle des services RDS](#3-configuration-de-la-passerelle-des-services-rds)
4. [Configurer le gestionnaire de licences](#4-configurer-le-gestionnaire-de-licences)
5. [Configurer la collection RemoteApp](#5-configurer-la-collection-remoteapp)
6. [Création du fichier MSIX](#6-création-du-fichier-msix)
7. [Signature du fichier MSIX (auto-signé)](#7-signature-du-fichier-msix-auto-signé)
8. [Connexion aux programmes RemoteApp](#8-connexion-aux-programmes-remoteapp)
9. [Annexes](#9-annexes)

## 1. Prérequis

### Machine 1 — Serveur

- OS : Windows Server 2022
- RAM : 4 Go
- Stockage : 40 Go
- IP statique : 192.168.10.10

### Machine 2 — Client

- OS : Windows 11
- RAM : 6 Go
- Stockage : 80 Go
- IP statique : 192.168.10.50

## 2. Installation des services Bureau à distance

Créer une machine Windows Server que vous ajouterez à votre domaine avec un nom spécifique, pour ma part `SRV-APP`.

![Création de la VM SRV-APP](/images/rds/_page_1_Picture_3.jpeg)

Une fois connecté sur le serveur avec un compte disposant des droits d'administration, ouvrez le Gestionnaire de serveur. Cliquez sur **Gérer** puis sur **Ajouter des rôles et fonctionnalités**.

![Gestionnaire de serveur](/images/rds/_page_1_Picture_5.jpeg)

Sélectionnez **Installation basée sur un rôle ou une fonctionnalité**.

![Sélection du type d'installation](/images/rds/_page_2_Picture_5.jpeg)

Cochez **Services Bureau à distance**.

![Sélection du rôle RDS](/images/rds/_page_2_Picture_7.jpeg)

Dans les fonctionnalités, cochez **Assistance à distance**.

![Assistance à distance](/images/rds/_page_3_Picture_5.jpeg)

Dans les services de rôles, cochez tous les services **sauf** "Hôte de virtualisation des services Bureau à distance".

![Services de rôles](/images/rds/_page_3_Picture_7.jpeg)

Confirmez et attendez la fin de l'installation. Une fois le serveur redémarré, vous aurez accès aux services via le Gestionnaire de serveur.

![Installation terminée](/images/rds/_page_4_Figure_5.jpeg)

Pour pouvoir utiliser ce service, vous devez ajouter un dernier service. Relancez **Ajouter des rôles ou des fonctionnalités** et sélectionnez cette fois **Installation des services Bureau à distance**.

![Installation services Bureau à distance](/images/rds/_page_4_Figure_7.jpeg)

Sélectionnez **Démarrage rapide** car nous allons mettre tous les services sur le même serveur.

![Démarrage rapide](/images/rds/_page_5_Figure_5.jpeg)

Sélectionnez **Déploiement basé sur une session** car on va se connecter en RDS via les utilisateurs présents dans l'AD.

![Déploiement basé sur une session](/images/rds/_page_5_Picture_7.jpeg)

Sélectionnez votre serveur puis cliquez sur **Déployer**. Le service va s'installer sur votre serveur.

![Sélection du serveur](/images/rds/_page_6_Figure_4.jpeg)

On peut maintenant voir dans les Services Bureau à distance différents outils que nous allons paramétrer.

![Vue d'ensemble RDS](/images/rds/_page_6_Picture_6.jpeg)

Vérifiez dans les propriétés système que l'Assistance à distance et le Bureau à distance sont autorisés.

![Propriétés système](/images/rds/_page_7_Picture_5.jpeg)

## 3. Configuration de la Passerelle des services RDS

On va faire en sorte que les machines qui se connectent en RDS passent bien par notre serveur. Sur la vue d'ensemble, cliquez sur **Passerelle des services**.

![Passerelle des services](/images/rds/_page_8_Figure_3.jpeg)

---
Sélectionnez votre serveur puis, pour le nom du certificat, entrez le nom de votre machine + le nom de domaine.

![Configuration certificat](/images/rds/_page_9_Picture_5.jpeg)

---
Confirmez puis attendez la fin du téléchargement.

![Téléchargement en cours](/images/rds/_page_9_Picture_7.jpeg)

---
Avant de fermer, cliquez sur **Configurer le certificat**.

![Configurer le certificat](/images/rds/_page_10_Figure_5.jpeg)

---
Cliquez sur **Créer un certificat…**, pour le nom mettez le même que le certificat SSL, stockez-le et cochez la case en dessous.

![Création du certificat](/images/rds/_page_10_Picture_7.jpeg)

---
Cliquez sur **Appliquer**. Répétez la même opération sur les 3 autres services en sélectionnant **Sélectionner un certificat existant…** et en prenant le certificat que vous venez de créer + son mot de passe (appliquez les certificats un par un). Vous obtenez ceci à la fin :

![Certificats appliqués](/images/rds/_page_11_Figure_5.jpeg)

---
Cliquez sur **OK**, votre passerelle des services est maintenant configurée. Dans **Tâches** → **Modifier les propriétés de déploiement** :

![Propriétés de déploiement](/images/rds/_page_12_Picture_5.jpeg)

---
Dans **Passerelle des serveurs**, votre serveur doit bien être précisé. Si la méthode d'ouverture de session n'est pas comme celle affichée ci-dessous, modifiez-la.

![Méthode d'ouverture de session](/images/rds/_page_12_Picture_7.jpeg)

## 4. Configurer le gestionnaire de licences

Toujours dans la vue d'ensemble des Services Bureau à distance, cliquez sur **Gestionnaire de licences**. Sélectionnez votre serveur puis confirmez, attendez la fin du téléchargement.

![Gestionnaire de licences](/images/rds/_page_13_Picture_6.jpeg)

---
Cliquez sur **Vérifier les propriétés du Gestionnaire de licences des services Bureau à distance pour le déploiement**. On va se connecter via nos utilisateurs présents dans l'AD, sélectionnez **Par utilisateur** puis **Appliquer** et **OK**.

![Configuration par utilisateur](/images/rds/_page_14_Figure_5.jpeg)

---
Votre Gestionnaire de licences est maintenant configuré.

![Gestionnaire configuré](/images/rds/_page_14_Picture_7.jpeg)

## 5. Configurer la collection RemoteApp

Dans l'onglet **Collections**, il y en a une créée par défaut, supprimez-la pour créer notre collection. Dans **Tâches** → **Créer une collection de sessions**.

![Suppression collection par défaut](/images/rds/_page_15_Picture_3.jpeg)

![Créer une collection](/images/rds/_page_15_Picture_5.jpeg)

---
Nommez-la comme vous voulez.

![Nommage de la collection](/images/rds/_page_15_Picture_7.jpeg)

---
Sélectionnez votre serveur puis dans **Groupes utilisateurs**, sélectionnez les groupes qui pourront avoir accès à l'interface web pour lancer les applications. Pour ma part j'ai mis tous les utilisateurs du domaine, mais on peut restreindre l'accès si besoin.

![Groupes utilisateurs](/images/rds/_page_16_Figure_1.jpeg)

---
Décochez la case **Activer les disques de profil utilisateur**.

![Disques de profil](/images/rds/_page_16_Picture_3.jpeg)

---
Confirmez, une fois le téléchargement terminé vous pouvez fermer.

![Installation collection](/images/rds/_page_17_Figure_1.jpeg)

---
On va maintenant sélectionner les applications que l'on veut que nos utilisateurs puissent utiliser à distance. Dans **Collections**, sélectionnez celle que vous venez de créer puis **Publier des programmes RemoteApp**.

![Publier RemoteApp](/images/rds/_page_17_Picture_3.jpeg)

## 6. Création du fichier MSIX

Nous allons maintenant créer un fichier MSIX pour 7-Zip. Vous pourrez faire ça sur autant d'applications que vous voulez.

Sur la machine client, allez sur le Microsoft Store et installez **MSIX packaging tool**.

![MSIX Packaging Tool](/images/rds/_page_18_Picture_7.jpeg)

---
Sélectionnez **Package d'installation**.

![Package d'installation](/images/rds/_page_18_Picture_9.jpeg)

---
Sélectionnez **Créer un package sur cet ordinateur**.

![Créer un package local](/images/rds/_page_19_Figure_1.jpeg)

---
Nous allons utiliser 7-Zip, récupérez le `.exe` sur un navigateur et indiquez-le dans l'utilitaire.

![Sélection de l'exécutable](/images/rds/_page_19_Picture_3.jpeg)

---
Renseignez les différentes informations obligatoires dans le formulaire.

![Formulaire d'informations](/images/rds/_page_20_Picture_4.jpeg)

---
Faites **Suivant** pour arriver à cette page puis **Créer** le fichier MSIX.

![Création du fichier MSIX](/images/rds/_page_20_Picture_6.jpeg)

---
Le fichier `.msix` est désormais créé, déplacez-le vers votre serveur RDS pour continuer la configuration.

![Fichier MSIX créé](/images/rds/_page_21_Picture_5.jpeg)

## 7. Signature du fichier MSIX (auto-signé)

Pour pouvoir utiliser le logiciel sur votre serveur RDS, vous devez créer un certificat auto-signé. Les commandes PowerShell suivantes sont à adapter selon le logiciel que vous installez.

Créez le certificat auto-signé :

```powershell
$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=7zip" -CertStoreLocation Cert:\LocalMachine\My
```

Exportez la clé publique du certificat dans un fichier `.cer` pour pouvoir l'installer sur d'autres machines :

```powershell
Export-Certificate -Cert $cert -FilePath C:\Packages\7zip.cer
```

Convertissez le mot de passe en SecureString, puis exportez le certificat avec sa clé privée dans un fichier `.pfx` protégé par mot de passe :

```powershell
$pwd = ConvertTo-SecureString -String "1234" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath C:\Packages\7zip.pfx -Password $pwd
```

Signez le package MSIX avec le certificat `.pfx` afin qu'il puisse être installé et reconnu comme application fiable :

```powershell
signtool sign /fd SHA256 /f C:\Packages\7zip.pfx /p 1234 "C:\Packages\7zip.msix"
```

Installez le package MSIX pour tous les utilisateurs du système :

```powershell
Add-AppxProvisionedPackage -Online -PackagePath C:\Packages\7zip.msix -SkipLicense
```

Publiez 7-Zip en application RemoteApp sur le serveur RDS :

```powershell
New-RDRemoteApp -CollectionName "RemoteApp" -Alias "7zip" -DisplayName "7-Zip" -FilePath "C:\Windows\System32\cmd.exe" -CommandLineSetting Require -RequiredCommandLine '/c start "" shell:AppsFolder\7zip_kc7rvhsejyqfe!App'
```

Redémarrez le serveur puis allez de nouveau sur l'interface graphique de RDS, onglet **Collections** → **RemoteApp**. Vous devez normalement voir votre application.

![Application publiée](/images/rds/_page_24_Picture_7.jpeg)

> Répétez les étapes 6 et 7 pour chaque application supplémentaire à publier.

## 8. Connexion aux programmes RemoteApp

Votre serveur est maintenant opérationnel. Sur votre machine client, tapez dans un navigateur :

**https://nom\_du\_serveur.nom\_du\_domaine/rdweb**

Renseignez les informations de connexion de votre utilisateur puis cliquez sur **S'inscrire**.

![Page de connexion RDWeb](/images/rds/_page_25_Picture_6.jpeg)

---
Vous voyez les applications de votre collection. Sélectionnez-en une et dans **Téléchargements**, ouvrez le fichier `.rdp`.

![Applications disponibles](/images/rds/_page_25_Picture_8.jpeg)

---
Cliquez sur **Connexion** et renseignez vos identifiants en précisant votre nom de domaine. Vous voilà connecté à votre application — les ressources sont stockées sur le serveur RDS, la machine cliente ne consomme pas plus de ressources.

![Connexion RemoteApp active](/images/rds/_page_26_Picture_6.jpeg)

![Application en cours d'utilisation](/images/rds/_page_26_Picture_7.jpeg)

## 9. Annexes

### Architecture simplifiée

![Architecture RDS simplifiée](/images/rds/_page_27_Figure_6.jpeg)

### Bonus — Mise en place d'une troisième application

Après avoir répété les parties 6 et 7, la nouvelle application apparaît dans **Collections** → **RemoteApp**.

![Troisième application publiée](/images/rds/_page_28_Picture_7.jpeg)

---
Elle est également visible sur l'interface web côté client.

![Interface web client](/images/rds/_page_29_Picture_3.jpeg)

![Application sur client](/images/rds/_page_29_Picture_4.jpeg)

### Désinstallation d'un package MSIX

Pour désinstaller une application (exemple avec 7-Zip) :

Désinstaller pour tous les utilisateurs :

```powershell
Get-AppxPackage -AllUsers 7zip | Remove-AppxPackage -AllUsers
```

Supprimer le provisionnement (important en environnement serveur) :

```powershell
Get-AppxProvisionedPackage -Online | Where-Object {$_.DisplayName -like "7zip"} | Remove-AppxProvisionedPackage -Online
```
