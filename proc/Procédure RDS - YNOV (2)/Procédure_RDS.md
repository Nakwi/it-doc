# Prérequis :

## 2 machines

- OS : Windows - Server 2022

- Ram : 4 Go

- Stockage : 40 Go

- IP statique : 192.168.10.10

***
- OS : Windows 11 Client

- Ram : 6 Go

- Stockage : 80 Go

- IP statique : 192.168.10.50

## Sommaire:

1. [Installation des services Bureau à distance](#i-installation-des-services-bureau-à-distance)

2. [Configuration de la Passerelle des services RDS](#ii-configuration-de-la-passerelle-des-services-rds)

3. [Configurer le gestionnaire de licences](#iii-configurer-le-gestionnaire-de-licences)

4. [Configurer la collection RemoteApp](#iv-configurer-la-collection-remoteapp)

5. [Création du fichier MSIX](#v-création-du-fichier-msix)

6. [Signature du fichier MSIX (auto-signé)](#vi-signature-du-fichier-msix-auto-signé)

7. [Connexion aux programmes RemoteApp](#vii-connexion-aux-programmes-remoteapp)

8. [Annexes](#viii-annexes)
   - [Bonus](#bonus)
   - [Mise en place d’une troisième application](#mise-en-place-dune-troisième-application)
   - [Désinstallation du package MSIX](#désinstallation-du-package-msix)

# <span id="page-1-0"></span>I. Installation des services Bureau à distance

1. Créer une machine Windows Server que vous ajouterai à votre domaine et un nom spécifique, pour ma part "SRV-APP".

![](_page_1_Picture_3.jpeg)

2. Une fois connecté sur le serveur avec un compte disposant des droits d'administration, ouvrez le Gestionnaire de serveur. Cliquez sur "Gérer" puis sur "Ajouter des rôles et fonctionnalités".

![](_page_1_Picture_5.jpeg)


3. Sélectionnez "Installation basée sur un rôle ou une fonctionnalité"

![](_page_2_Picture_5.jpeg)

4. Cochez "Services Bureau à distance"

![](_page_2_Picture_7.jpeg)


5. Dans les fonctionnalités, cochez "Assistance à distance".

![](_page_3_Picture_5.jpeg)

6. Dans les services de rôles, cochez tous sauf "hôte de virtualisation des services Bureau à distance".

![](_page_3_Picture_7.jpeg)

7. Confirmez et attendez la fin de l'installation. Une fois que le serveur à redémarrer, vous aurez accès aux services de Bureaux à distance via les gestionnaire de serveur

![](_page_4_Figure_5.jpeg)

8. Cependant, pour vous servir de ce service, vous devez ajouter un dernier service. De nouveau "Ajouter des rôles ou des fonctionnalités" mais cette fois-ci, sélectionnez "Installation des services Bureau à distance".

![](_page_4_Figure_7.jpeg)


9. Sélectionnez "Démarrage rapide car nous allons mettre tous les services sur le même serveur.

![](_page_5_Figure_5.jpeg)

10. Sélectionnez "Déploiement basés sur une session" car on va se connecter en RDS via les user présent dans l'AD.

![](_page_5_Picture_7.jpeg)


11. Sélectionnez votre serveur puis "Déployer", le service va s'installer sur votre serveur

![](_page_6_Figure_4.jpeg)

12. On peut maintenant voir dans les Services Bureau à distance différents outils que nous allons paramétrer.

![](_page_6_Picture_6.jpeg)


13. Vérifiez dans les propriétés système que l'Assistance à distance et le Bureau à distance sont autorisés.

![](_page_7_Picture_5.jpeg)

# <span id="page-8-0"></span>II. Configuration de la Passerelle des services RDS

1. On va faire en sorte que les machines qui se connectent en RDS passent bien par notre serveur pour accéder aux services Bureau à distance. Sur la vue d'ensemble, cliquez sur "Passerelle des services".

![](_page_8_Figure_3.jpeg)


2. Sélectionnez votre serveur puis, pour le nom du certificat, rentrez le nom de votre machine + le nom de domaine.

![](_page_9_Picture_5.jpeg)

3. Confirmer puis attendez la fin du téléchargement

![](_page_9_Picture_7.jpeg)

4. Avant de fermer, cliquez sur "Configurer le certificat".

![](_page_10_Figure_5.jpeg)

5. Cliquez sur "Créer un certificat…", pour le nom mettez le même que le certificat SSL, stockez-le et cochez la case en dessous.

![](_page_10_Picture_7.jpeg)


6. Cliquez ensuite sur Appliquer. Une fois fait, répétez la mêmes sur les 3 autres services en sélectionnant "Sélectionner un certificat existant…" et en prenant le certificat que vous venez de créer + son mot de passe (Appliquer les certificats 1 par 1). Vous obtenez ceci à la fin.

![](_page_11_Figure_5.jpeg)


7. Cliquez sur OK, votre passerelle des services est maintenant configurée. On peut voir dans "Tâches" -> "Modifier les propriétés de déploiement".

![](_page_12_Picture_5.jpeg)

8. Dans Passerelle des serveurs, notre serveur à bien été précisé. Si par défaut la méthode d'ouverture de session n'est pas comme celle affichée ci-dessous, modifiez-la pour quelle correspond.

![](_page_12_Picture_7.jpeg)


# <span id="page-13-0"></span>III. Configurer le gestionnaire de licences

1. Toujours dans la vue d'ensemble des Services Bureau à distance, cliquez cette fois-ci sur "Gestionnaire de licences". Sélectionner votre serveur puis confirmer, attendez la fin du téléchargement.

![](_page_13_Picture_6.jpeg)



2. Cliquez sur "Vérifier les propriétés du Gestionnaire de licences des services Bureau à distance pour le déploiement". On va se connecter via nos users présent dans l'AD, sélectionnez Par utilisateur puis Appliquer et OK.

![](_page_14_Figure_5.jpeg)

3. Votre Gestionnaire de licences est maintenant configuré.

![](_page_14_Picture_7.jpeg)

## <span id="page-15-0"></span>IV. Configurer la collection RemoteApp

1. Dans l'onglet collections, il y en a une qui est créée par défaut, on va la supprimer pour créer notre collection.

![](_page_15_Picture_3.jpeg)

2. Dans "Tâches"->"Créer une collection de sessions"

![](_page_15_Picture_5.jpeg)

3. Nommez la comme vous voulez.

![](_page_15_Picture_7.jpeg)

4. Sélectionnez votre serveur puis dans Groupes utilisateurs, sélectionnez les groupes qui pourront avoir accès à l'interface web pour lancer les applications. Pour ma part, j'ai mis tous les utilisateurs du domaine mais on peux restreindre l'accès si besoin.

![](_page_16_Figure_1.jpeg)

5. Décochez la case "Activer les disques de profil utilisateur"

![](_page_16_Picture_3.jpeg)

6. Confirmez, une fois le téléchargement terminé, vous pouvez fermer.



![](_page_17_Figure_1.jpeg)

7. On va maintenant sélectionner les applications que l'on veut que nos utilisateurs puissent utiliser à distance. Dans Collections, sélectionnez celle que vous venez de créer puis Publier des programmes RemoteApp.

![](_page_17_Picture_3.jpeg)


# <span id="page-18-0"></span>V. Création du fichier MSIX

Nous allons maintenant faire la création d'un fichier MSIX pour 7zip. Vous pourrez faire ça sur autant d'applications voulu.

1. Sur la machine client qui va utiliser la connexion RDS, allez sur le microsoft store est installé le logiciel "MSIX packaging tool"

![](_page_18_Picture_7.jpeg)

2. Sélectionner "Package d'installation"

![](_page_18_Picture_9.jpeg)

3. Sélectionner "Créer un package sur cet ordinateur"


![](_page_19_Figure_1.jpeg)

4. Nous allons utiliser 7-zip, récupérer le .exe sur un navigateur est indiqué le sur l'utilitaire d'installation à empaqueter

![](_page_19_Picture_3.jpeg)

5. Indiquer les différentes informations obligatoire dans le formulaire



![](_page_20_Picture_4.jpeg)

6. Faites "Suivant" pour arriver à cette page puis "Créer" le fichier msix

![](_page_20_Picture_6.jpeg)

7. Le fichier .msix est désormais créer, déplacer le vers votre serveur RDS pour continuer la configuration

![](_page_21_Picture_5.jpeg)


# <span id="page-22-0"></span>VI. Signature du fichier MSIX (auto-signé)

1. Pour pouvoir utiliser le logiciel sur votre serveur RDS, vous devez créer un certificat auto signé. On va utiliser les commandes Powershell suivantes "qui sont modifiées selon le logiciel que vous installer".

```
$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject
"CN=7zip" -CertStoreLocation Cert:\LocalMachine\My
```

2. Exporter la clé publique du certificat dans un fichier .cer pour pouvoir l'installer sur d'autres machines.

```
Export-Certificate -Cert $cert -FilePath C:\Packages\7zip.cer
```

3. Convertir le mot de passe en SecureString, puis exporter le certificat avec sa clé privée dans un fichier .pfx protégé par mot de passe.

```
$pwd = ConvertTo-SecureString -String "1234" -Force -AsPlainText Export-PfxCertificate -Cert \$cert -FilePath C:\Packages\7zip.pfx -Password $pwd
```

4. Signe le package MSIX avec le certificat .pfx afin qu'il puisse être installé et reconnu comme application fiable.

```
signtool sign /fd SHA256 /f C:\Packages\7zip.pfx /p 1234
"C:\Packages\7zip.msix"
```

5. Installe le package MSIX pour tous les utilisateurs du système afin qu'il soit disponible sur la machine.

```
Add-AppxProvisionedPackage -Online -PackagePath
C:\Packages\7zip.msix -SkipLicense
```


6. Publier 7-Zip en application RemoteApp sur le serveur RDS en lançant l'application MSIX via shell:AppsFolder.

```
New-RDRemoteApp
-CollectionName "RemoteApp" -Alias "7zip"
-DisplayName "7-Zip" -FilePath "C:\Windows\System32\cmd.exe"
-CommandLineSetting Require -RequiredCommandLine '/c start ""
shell:AppsFolder\7zip_kc7rvhsejyqfe!App'
```

7. Redémarrez le serveur puis allez de nouveau sur l'interface graphique de RDS onglet "Collections" -> "RemoteApp". Vous devez normalement voir votre application

![](_page_24_Picture_7.jpeg)

[Répétez cette opération avec d'autres applis si nécessaire]


# <span id="page-25-0"></span>VII. Connexion aux programmes RemoteApp

1. Votre serveur est maintenant opérationnel, sur votre machine client, tapez sur un navigateur "https://nom\_du\_serveur+nom\_du\_domaine/rdweb" Vous allez arriver sur la page ci-dessous, renseignez les informations de connexion de votre user de la machine client puis cliquez sur "S'inscrire"

![](_page_25_Picture_6.jpeg)

2. On voit les applications de notre collection, sélectionnez en une. Dans téléchargement ouvrez le fichier .rdp

![](_page_25_Picture_8.jpeg)


- 3. Cliquez sur Connexion et renseignez vos identifiants en précisant votre nom de domaine
- 4. vous voila connecté à votre application ou les ressources de celle-ci sont stockées dans votre serveur RDS. De ce fait, l'ordinateur avec lequel vous vous connectez à distance ne consomme pas plus de ressources.

![](_page_26_Picture_6.jpeg)

![](_page_26_Picture_7.jpeg)


# <span id="page-27-0"></span>VIII. Annexes

## Architecture simplifié

![](_page_27_Figure_6.jpeg)



# <span id="page-28-0"></span>Bonus

## <span id="page-28-1"></span>Mise en place d'une troisième application

1. Nous avons répété la partie V et VI de la procédure pour ajouter une troisième application que l'on peut voir dans l'onglet "Collections"->"RemoteApp" de RDS

![](_page_28_Picture_7.jpeg)


2. Nous pouvons également voir l'application sur l'interface web côté client

![](_page_29_Picture_3.jpeg)

![](_page_29_Picture_4.jpeg)


# <span id="page-30-0"></span>Désinstallation du package MSIX

1. Pour désinstaller une application (7-Zip dans cet exemple), il faut effectuer les commandes suivantes:

## Désinstaller pour TOUS les users (RDS)

```
Get-AppxPackage -AllUsers 7zip | Remove-AppxPackage -AllUsers
```

## Supprimer aussi le provisionnement (IMPORTANT en serveur)

```
Get-AppxProvisionedPackage -Online | Where-Object {$_.DisplayName
-like "7zip"} | Remove-AppxProvisionedPackage -Online
```