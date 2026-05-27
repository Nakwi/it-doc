# Administration Utilisateur Active Directory

## Sommaire

- [I/ Utilisateurs](#i-utilisateurs)
  - [1 Création Utilisateurs](#1-création-utilisateurs)
    - [1.1 Utilisateur Classique](#11-utilisateur-classique)
    - [1.2 Création utilisateur depuis une variable](#12-création-utilisateur-depuis-une-variable)
    - [1.3 Création utilisateur interactif](#13-création-utilisateur-interactif)
      - [1.3.1 Récupération des information utilisateur](#131-récupération-des-information-utilisateur)
      - [1.3.2 Exécution des variable](#132-exécution-des-variable)
  - [2 Suppression Utilisateurs](#2-suppression-utilisateurs)
    - [2.1 Suppression classique](#21-suppression-classique)
  - [3 Recherche Informations Utilisateur](#3-recherche-informations-utilisateur)
    - [3.1 Recherche par nom](#31-recherche-par-nom)
    - [3.2 Informations mails](#32-informations-mails)
      - [3.2.1 Récupération mail d'un utilisateur](#321-récupération-mail-dun-utilisateur)
      - [3.2.2 Mails à partir d'une OU](#322-mails-à-partir-dune-ou)
    - [3.3 Date de création d'un compte](#33-date-de-création-dun-compte)
    - [3.4 Groupe et OU d'un utilisateur](#34-groupe-et-ou-dun-utilisateur)
    - [3.5 Nombre d'utilisateurs actifs](#35-nombre-dutilisateurs-actifs)
    - [3.6 Liste utilisateurs désactivé dans AD](#36-liste-utilisateurs-désactivé-dans-ad)
    - [3.7 Liste utilisateurs Inactif dans AD](#37-liste-utilisateurs-inactif-dans-ad)
  - [4 Paramétrage Utilisateurs](#4-paramétrage-utilisateurs)
    - [4.1 Paramétrage mots de passe](#41-paramétrage-mots-de-passe)
      - [4.1.1 Modification mot de passe instantané](#411-modification-mot-de-passe-instantané)
      - [4.1.2 Réinitialisation mot de passe](#412-réinitialisation-mot-de-passe)
    - [4.2 Gestion des Politiques de Mot de Passe et des Options de Compte](#42-gestion-des-politiques-de-mot-de-passe-et-des-options-de-compte)
    - [4.3 Gestion information utilisateur classique](#43-gestion-information-utilisateur-classique)
    - [4.4 Gestion des Groupes Utilisateurs](#44-gestion-des-groupes-utilisateurs)
      - [4.4.1 Ajouter un Utilisateur à un Groupe](#441-ajouter-un-utilisateur-à-un-groupe)
      - [4.4.2 Supprimer un Utilisateur à un Groupe](#442-supprimer-un-utilisateur-à-un-groupe)

## I/ Utilisateurs

Nous allons maintenant voir les différentes fonctionnalités du module Active Directory de façon individuel. Pour a la fin en combiner certaines sous forme de script d'administration.

L'administration des utilisateurs dans Active Directory est cruciale pour gérer efficacement l'accès aux ressources informatiques au sein d'une organisation. À travers ce chapitre, nous explorerons comment utiliser PowerShell pour ajouter, modifier, supprimer et rechercher des utilisateurs.

### 1 Création Utilisateurs

#### 1.1 Utilisateur Classique

Pour la création d'un utilisateur classique nous allons utiliser le cmdlet `New-ADUser` à la suite duquel nous allons spécifier des informations comme, le nom utilisateur et son OU.

```powershell
# Création de l'utilisateur
New-ADUser -Name "Angelo Vaque" `
  -DisplayName "VZQUE Angelo" `
  -GivenName "Angel" `
  -Surname "Vazue" `
  -SamAccountName "avasque" `
  -UserPrincipalName "avasque@domcor.lan" `
  -EmailAddress "angelo.vazque@domcor.lan" `
  -Path "OU=BTS SIO SISR,OU=Etudiants,DC=DOMCOR,DC=LAN" `
  -AccountPassword (Read-Host -AsSecureString "Mot de passe ?") `
  -ChangePasswordAtLogon $true `
  -Enabled $true
```

Dans cet exemple :

- `Name` : Définit le nom complet de l'utilisateur dans Active Directory.
- `GivenName` : Spécifie le prénom de l'utilisateur.
- `Surname` : Définit le nom de famille de l'utilisateur.
- `SamAccountName` : Définit le nom de compte SAM (Security Accounts Manager), qui est utilisé pour l'authentification Windows.
- `UserPrincipalName` : Spécifie le nom d'utilisateur principal (UPN), une forme alternative de nom d'utilisateur pour l'authentification.
- `EmailAddress` : Définit l'adresse e-mail de l'utilisateur.
- `Path` : Spécifie l'Unité Organisation (OU) ou l'utilisateur sera créé.
- `AccountPassword` : Définit le mot de passe du compte utilisateur. La fonction `ConvertTo-SecureString` est utilisée pour convertir la chaîne de caractères en un objet `SecureString`.
- `ChangePasswordAtLogon` : Indique que l'utilisateur devra changer son mot de passe lors de sa prochaine connexion.
- `Enabled` : est utilisé pour rendre l'utilisateur actif ou non de façon booléen (`$True` ou `$False`).

#### 1.2 Création utilisateur depuis une variable

Après avoir vu précédemment comment créer un utilisateur classique nous allons utiliser des variables pour une approche plus dynamique. Ce qui rendra la création plus flexible à l'avenir comme dans des script, ou des besoins récurrents.

```powershell
# Définition des variables pour la création de l'utilisateur
$nomComplet = "Angelo Vaque"
$nomAffichage = "VAQUE Angelo"
$prenom = "Angel"
$nom = "Vaque"
$samAccountName = "avasque"
$upn = "avaque@domcor.lan"
$email = "angelo.vaque@domcor.lan"
$ou = "OU=BTS SIO SISR,OU=Etudiants,DC=DOMCOR,DC=LAN"
$motDePasse = Read-Host -Prompt "Entrez le mot de passe" -AsSecureString
$changerMotDePasse = $true

# Création de l'utilisateur avec les variables définies
New-ADUser -Name $nomComplet `
  -DisplayName $nomAffichage `
  -GivenName $prenom `
  -Surname $nom `
  -SamAccountName $samAccountName `
  -UserPrincipalName $upn `
  -EmailAddress $email `
  -Path $ou `
  -AccountPassword $motDePasse `
  -ChangePasswordAtLogon $changerMotDePasse `
  -Enabled $true
```

Ici j'ai donc repris les informations de notre 1er utilisateur. Dans un premier temps je vais initialiser les différentes variables avec tous les paramètres. En respectant bien le `$` pour préciser que c'est une variable. Une fois toutes les variables initialisées, il ne me reste plus qu'à utiliser notre premier script classique et à notifier chacune de nos variables.

A préciser que ici pour le mot de passe j'utilise `Read-Host` qui est un cmdlet qui permet de demander des informations directement depuis l'interface powershell. Et qui stockera donc le mot de passe. Toujours de façon sécurisée avec `-AsSecureString`.

#### 1.3 Création utilisateur interactif

Nous allons maintenant dans cette dernière partie sur la création utilisateur, voir comment créer des utilisateur de façon interactive avec powershell. Pour ce faire, nous allons mélanger les différents points que nous avons appris plus tôt.

Voici notre script complet :

```powershell
Write-Host "# Création d'un utilisateur dans le domaine $((Get-ADDomain).DNSRoot)" -ForegroundColor Cyan

$UtilisateurPrenom = Read-Host -Prompt "Prénom"
$UtilisateurNom = Read-Host -Prompt "Nom"
$UtilisateurLogin = Read-Host -Prompt "Identifiant"
$UtilisateurMotDePasse = Read-Host -Prompt "Mot de passe" -AsSecureString
$UtilisateurEmail = Read-Host -Prompt "Adresse e-mail"
$UtilisateurFonction = Read-Host -Prompt "Fonction"
$UtilisateurOU = (Get-ADOrganizationalUnit -Filter * | Out-GridView -Title "Choisissez une OU pour cet utilisateur" -PassThru).DistinguishedName
$UtilisateurGroupes = (Get-ADGroup -Filter * -SearchBase "DC=domcor,DC=lan" | Out-GridView -Title "Choisissez un ou plusieurs groupes pour cet utilisateur" -PassThru).Name

# Vérifier la présence de l'utilisateur dans l'AD
if (Get-ADUser -Filter {SamAccountName -eq $UtilisateurLogin}) {
  Write-Warning "L'identifiant $UtilisateurLogin existe déjà dans l'AD"
}
else {
  New-ADUser -Name "$UtilisateurNom $UtilisateurPrenom" `
    -DisplayName "$UtilisateurNom $UtilisateurPrenom" `
    -GivenName $UtilisateurPrenom `
    -Surname $UtilisateurNom `
    -SamAccountName $UtilisateurLogin `
    -UserPrincipalName "$UtilisateurLogin@$((Get-ADDomain).DNSRoot)" `
    -EmailAddress $UtilisateurEmail `
    -Title $UtilisateurFonction `
    -Path $UtilisateurOU `
    -AccountPassword $UtilisateurMotDePasse `
    -ChangePasswordAtLogon $true `
    -Enabled $true
}

# Ajouter l'utilisateur aux groupes spécifiés
foreach ($Groupe in $UtilisateurGroupes) {
  Add-ADGroupMember -Identity $Groupe -Members $UtilisateurLogin
}
```

Pour mieux comprendre le script nous allons le diviser en 2 Partie.

##### 1.3.1 Récupération des information utilisateur

Dans la première partie de notre script qui est la suivant :

```powershell
Write-Host "# Création d'un utilisateur dans le domaine $((Get-ADDomain).DNSRoot)" -ForegroundColor Cyan

$UtilisateurPrenom = Read-Host -Prompt "Prénom"
$UtilisateurNom = Read-Host -Prompt "Nom"
$UtilisateurLogin = Read-Host -Prompt "Identifiant"
$UtilisateurMotDePasse = Read-Host -Prompt "Mot de passe" -AsSecureString
$UtilisateurEmail = Read-Host -Prompt "Adresse e-mail"
$UtilisateurFonction = Read-Host -Prompt "Fonction"
$UtilisateurOU = (Get-ADOrganizationalUnit -Filter * | Out-GridView -Title "Choisissez une OU pour cet utilisateur" -PassThru).DistinguishedName
$UtilisateurGroupes = (Get-ADGroup -Filter * -SearchBase "DC=domcor,DC=lan" | Out-GridView -Title "Choisissez un ou plusieurs groupes pour cet utilisateur" -PassThru).Name
```

l'objectif est de stocker chacune de nos informations dans des variables, pour pouvoir les utiliser dans la suite du script. La principale différence entre ce script et celui vu dans le chapitre précédent, c'est que ici le script est intéractif. C'est à son utilisateur de remplir les informations directement depuis l'interface powershell. Cela est possible grâce à l'utilisateur du cmdlet `Read-Host` liée à une variable.

Par exemple ici pour le prénom. Le `Read-Host` demande à l'utilisateur de remplir directement l'information. Et une fois entré, la donnée sera stockée dans la variable `$UtilisateurPrenom`.

Dans la suite du script nous avons une commande qui ne correspond à aucune vue précédemment qui est liée à la variable `$UtilisateurOU`. Pour récupérer OU de destination de notre futur utilisateur nous pouvons utiliser un `Read-Host` classique et remplir OU sous cette forme : `OU=RH, DC=DOMCOR, DC=LAN`. Mais pour une meilleure utilisation nous allons demander à l'utilisateur de choisir l'OU en fonction de celle déjà existante. Ce qui va grandement limiter les erreurs.

Pour ce faire le script utilise cette commande :

```powershell
$UtilisateurOU = (Get-ADOrganizationalUnit -Filter * | Out-GridView -Title "Choisissez une OU pour cet utilisateur" -PassThru).DistinguishedName
```

- `Get-ADOrganizationalUnit -Filter *` : Récupère toutes les Unités d'Organisation (OU) de l'Active Directory en utilisant le filtre `*`, ce qui signifie qu'il récupère toutes les OUs sans filtrage supplémentaire.
- `Out-GridView -Title "Choisissez une OU pour cet utilisateur" -PassThru` : Après avoir obtenu toutes les OUs, cette partie de la commande affiche une boîte de dialogue graphique (`Out-GridView`) avec un titre spécifié ("Choisissez une OU pour cet utilisateur"). Cela permet à l'utilisateur de choisir visuellement une OU parmi celles récupérées. L'option `-PassThru` est utilisée pour renvoyer la valeur sélectionnée par l'utilisateur.
- `(Get-ADOrganizationalUnit ...).DistinguishedName` : Enfin, la commande complète stocke la valeur de la propriété `DistinguishedName` de l'OU sélectionnée par l'utilisateur dans la variable `$UtilisateurOU`. Le `DistinguishedName` est un identifiant unique pour chaque objet dans Active Directory, et il est utilisé ici pour représenter l'OU choisie.

Enfin le script utilise aussi le même principe pour renseigner les/le groupe(s) du nouvel utilisateur.

```powershell
$UtilisateurGroupes = (Get-ADGroup -Filter * -SearchBase "DC=domcor,DC=lan" | Out-GridView -Title "Choisissez un ou plusieurs groupes pour cet utilisateur" -PassThru).Name
```

##### 1.3.2 Exécution des variable

Maintenant après avoir au préalable renseigner toutes nos informations, il nous reste simplement à utiliser les informations stockées dans nos variables.

```powershell
# Vérifier la présence de l'utilisateur dans l'AD
if (Get-ADUser -Filter {SamAccountName -eq $UtilisateurLogin}) {
  Write-Warning "L'identifiant $UtilisateurLogin existe déjà dans l'AD"
}
else {
  New-ADUser -Name "$UtilisateurNom $UtilisateurPrenom" `
    -DisplayName "$UtilisateurNom $UtilisateurPrenom" `
    -GivenName $UtilisateurPrenom `
    -Surname $UtilisateurNom `
    -SamAccountName $UtilisateurLogin `
    -UserPrincipalName "$UtilisateurLogin@$((Get-ADDomain).DNSRoot)" `
    -EmailAddress $UtilisateurEmail `
    -Title $UtilisateurFonction `
    -Path $UtilisateurOU `
    -AccountPassword $UtilisateurMotDePasse `
    -ChangePasswordAtLogon $true `
    -Enabled $true
}

# Ajouter l'utilisateur aux groupes spécifiés
foreach ($Groupe in $UtilisateurGroupes) {
  Add-ADGroupMember -Identity $Groupe -Members $UtilisateurLogin
}
```

Ici la première partie du script est de vérifier si les informations renseignées ne correspondent pas avec un utilisateur déjà existant dans notre AD.

Pour ce faire nous utilisons cette commande :

```powershell
if (Get-ADUser -Filter {SamAccountName -eq $UtilisateurLogin}) {
  Write-Warning "L'identifiant $UtilisateurLogin existe déjà dans l'AD"
}
```

- `if` : Pour rentrer le principe de conditions.
- `Get-ADUser -Filter {SamAccountName -eq $UtilisateurLogin}` : C'est comme une recherche dans le répertoire d'utilisateurs. On demande à PowerShell de chercher un utilisateur où le nom d'utilisateur (`SamAccountName`) correspond (`-eq`) à ce que l'utilisateur a saisi dans `$UtilisateurLogin`.
- `Write-Warning "..."` : Si PowerShell trouve un utilisateur avec le même identifiant, il affiche un avertissement indiquant que cet identifiant existe déjà dans Active Directory.

Et si les informations utilisateurs ne correspondent pas avec un déjà existant alors le script existant le code suivant :

```powershell
else {
  New-ADUser -Name "$UtilisateurNom $UtilisateurPrenom" `
    -DisplayName "$UtilisateurNom $UtilisateurPrenom" `
    -GivenName $UtilisateurPrenom `
    -Surname $UtilisateurNom `
    -SamAccountName $UtilisateurLogin `
    -UserPrincipalName "$UtilisateurLogin@$((Get-ADDomain).DNSRoot)" `
    -EmailAddress $UtilisateurEmail `
    -Title $UtilisateurFonction `
    -Path $UtilisateurOU `
    -AccountPassword $UtilisateurMotDePasse `
    -ChangePasswordAtLogon $true `
    -Enabled $true
}

# Ajouter l'utilisateur aux groupes spécifiés
foreach ($Groupe in $UtilisateurGroupes) {
  Add-ADGroupMember -Identity $Groupe -Members $UtilisateurLogin
}
```

Ici nous connaissons déjà une partie des commandes, à l'aide de `New-ADUser` powershell va créer notre utilisateurs en utilisant les informations stockées dans nos variables.

La seul commande que nous ne connaissons pas est :

```powershell
foreach ($Groupe in $UtilisateurGroupes) {
  Add-ADGroupMember -Identity $Groupe -Members $UtilisateurLogin
}
```

Ici nous avons l'utilisation de Forreach, qui va stocker tous nos groupe sélectionnés dans une nouvelle variable qui est `$Groupe` et à l'aide de `Add-ADGroupMember` que nous allons étudier plus tard les intégrer à notre nouvel utilisateur.

### 2 Suppression Utilisateurs

#### 2.1 Suppression classique

Pour la suppression d'un utilisateur classique nous allons utiliser le cmdlet `remove-aduser` à la suite duquel nous allons spécifier des paramètres.

```powershell
Remove-ADUser -Identity "NomUtilisateur"
```

### 3 Recherche Informations Utilisateur

#### 3.1 Recherche par nom

La première permet de faire ressortir les informations utilisateur à partir directement d'un `SamAccountName`. Ici donc de rcorsyn. A l'aide du cmdlet `Get-ADUser`.

```powershell
Get-ADUser -Filter "SamAccountName -eq 'rcorsyn'"
```

Il est aussi possible de faire directement cette commande pour avoir le même résultat.

```powershell
Get-ADUser rcorsyn
```

Enfin, il est aussi possible de lancer cette recherche en précisant de façon précise le serveur et le domaine.

```powershell
Get-ADUser -Filter "SamAccountName -eq 'rcorsyn'" -Server SRV-ADDS-01.domcor.lan
```

#### 3.2 Informations mails

##### 3.2.1 Récupération mail d'un utilisateur

La commande permet de récupérer l'adresse e-mail de l'utilisateur rcorsyn et de la formater en tableau à l'aide des cmdlets `Get-ADUser` et `Format-Table` avec la propriété `EmailAddress`.

```powershell
Get-ADUser rcorsyn -Properties EmailAddress | Format-Table EmailAddress
```

##### 3.2.2 Mails à partir d'une OU

Cette commande permet d'obtenir la liste des adresses mail des utilisateurs de l'OU DSI. La commande `Format-Table` permet de faire un tableau avec ici 2 colonnes à savoir `Name` et `EmailAdress`.

```powershell
Get-ADUser -Filter * -SearchBase "OU=DSI,OU=Personnel,DC=domcor,DC=LAN" -Properties EmailAddress | Format-Table Name,EmailAddress
```

#### 3.3 Date de création d'un compte

La commande permet de récupérer le nom et la date de création de l'utilisateur rcorsyn en utilisant le cmdlet `Get-ADUser` avec la propriété `WhenCreated`, puis de sélectionner et d'afficher uniquement les colonnes `Name` et `WhenCreated`.

```powershell
Get-ADUser rcorsyn -Properties WhenCreated | Select-Object Name, WhenCreated
```

#### 3.4 Groupe et OU d'un utilisateur

La commande permet de récupérer tous les groupes et OU auxquels appartient l'utilisateur rcorsyn en utilisant le cmdlet `Get-ADUser` avec la propriété `MemberOf`. La commande `Select-Object` avec l'option `-ExpandProperty MemberOf` affiche les noms des groupes directement.

```powershell
Get-ADUser -Identity rcorsyn -Properties memberof | Select-Object memberof -ExpandProperty memberof
```

#### 3.5 Nombre d'utilisateurs actifs

La commande permet de compter le nombre d'utilisateurs activés (`Enabled`) dans Active Directory en utilisant le cmdlet `Get-ADUser` avec le filtre `{ Enabled -eq $True }`, puis en accédant à la propriété `Count` pour obtenir le nombre total de ces utilisateurs.

```powershell
(Get-ADUser -Filter { Enabled -eq $True }).Count
```

#### 3.6 Liste utilisateurs désactivé dans AD

La commande permet de récupérer les noms et les `SamAccountName` des utilisateurs désactivés dans Active Directory en utilisant le cmdlet `Get-ADUser` avec le filtre `{ Enabled -eq $False }`, puis de formater et d'afficher les résultats en tableau avec les colonnes `SamAccountName` et `Name` à l'aide de `Format-Table`.

```powershell
Get-ADUser -Filter { Enabled -eq $False } | Format-Table SamAccountName, Name
```

#### 3.7 Liste utilisateurs Inactif dans AD

La commande recherche les comptes d'utilisateurs inactifs dans Active Directory depuis les 180 derniers jours en utilisant le cmdlet `Search-ADAccount` avec les options `-UsersOnly` pour rechercher uniquement les utilisateurs, `-AccountInactive` pour trouver les comptes inactifs, et `-TimeSpan 180` pour spécifier la durée de 180 jours. Ensuite, elle utilise `Where-Object` pour filtrer les résultats en excluant les comptes qui ont un `DistinguishedName` correspondant à "CN=Users" (c'est-à-dire les comptes d'utilisateurs standards) et qui sont activés (`Enabled` est égal à `$true`). Cela permet de ne récupérer que les comptes d'utilisateurs inactifs qui ne sont pas des comptes d'utilisateurs standard et qui sont activés.

```powershell
Search-ADaccount -UsersOnly -AccountInactive -Timespan 180 | Where{ ($_.DistinguishedName -notmatch "CN=Users") -and ($_.Enabled -eq $true) }
```

### 4 Paramétrage Utilisateurs

#### 4.1 Paramétrage mots de passe

##### 4.1.1 Modification mot de passe instantané

La commande permet de réinitialiser le mot de passe du compte utilisateur rcorsyn avec un nouveau mot de passe (`JzkS!12jsD!$`) dans Active Directory en utilisant le cmdlet `Set-ADAccountPassword` avec l'option `-Reset`. Le nouveau mot de passe est converti en une chaîne sécurisée à l'aide de `ConvertTo-SecureString` avec l'option `-AsPlainText` et `-Force`.

```powershell
Set-ADAccountPassword -Identity rcorsyn -Reset -NewPassword (ConvertTo-SecureString -AsPlainText "JzkS!12jsD!$" -Force)
```

##### 4.1.2 Réinitialisation mot de passe

La commande permet de réinitialiser le mot de passe du compte utilisateur rcorsyn dans Active Directory en utilisant le cmdlet `Set-ADAccountPassword` avec l'option `-Reset`, ce qui force la réinitialisation du mot de passe.

```powershell
Set-ADAccountPassword -Identity rcorsyn -Reset
```

#### 4.2 Gestion des Politiques de Mot de Passe et des Options de Compte

Voici un tableau présentant différents paramètres de gestion des comptes utilisateur, ainsi que les options correspondantes à utiliser en ligne de commande avec PowerShell :

| Paramètre | Commande |
| --- | --- |
| Doit changer le mot de passe à la prochaine Connexion | `-ChangePasswordAtLogon $true` |
| Le mot de passe n'expire jamais | `-PasswordNeverExpires $true` |
| Activation du compte | `-Enabled $true` |
| Désactivation du compte | `-Enabled $false` |
| Verrouillage du compte | `-AccountLockout $true` |
| Déverrouillage du compte | `Unlock-ADAccount` |

Exemple de commande qui utilise `-ChangePasswordAtLogon $true` :

```powershell
Set-ADUser -Identity rcorsyn -ChangePasswordAtLogon $true
```

#### 4.3 Gestion information utilisateur classique

Voici un tableau présentant différents paramètres de gestion des informations utilisateur classiques, ainsi que les options correspondantes à utiliser en ligne de commande avec PowerShell :

| Paramètre | Commande |
| --- | --- |
| Nom | `-Surname` |
| Prénom | `-GivenName` |
| Nom Complet | `-Name` |
| Nom d'Affichage | `-DisplayName` |
| Description | `-Description` |
| Adresse e-mail | `-EmailAddress` |
| Nom (SamAccountName) | `-SamAccountName` |
| Groupe Principal | `-UserPrincipalName` |
| Téléphone | `-OfficePhone` |
| Adresse | `-StreetAddress`, `-City`, `-State`, `-PostalCode`, `-Country` |
| Département affilié | `-Department` |

Voici un exemple concret d'utilisation pour définir l'adresse e-mail d'un utilisateur :

```powershell
Set-ADUser -Identity "rcorsyn" -EmailAddress "adresse.email@example.com"
```

#### 4.4 Gestion des Groupes Utilisateurs

##### 4.4.1 Ajouter un Utilisateur à un Groupe

Pour ajouter un utilisateur à un groupe il faudra simplement utiliser le cmdlet `Add-AdGroupMember` et puis spécifier le groupe puis l'utilisateur.

```powershell
Add-AdGroupMember -Identity gr_BTS -Members "avasque"
```

##### 4.4.2 Supprimer un Utilisateur à un Groupe

Pour supprimer un groupe à un utilisateur il faudra maintenant utiliser le cmdlet `Remove-AdGroupMember` et puis spécifier le groupe et l'utilisateur.

```powershell
Remove-AdGroupMember -Identity gr_BTS -Members avasque -Confirm:$false
```
