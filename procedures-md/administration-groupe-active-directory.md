---
title: "Administration des groupes Active Directory en PowerShell"
category: powershell
subcategory: active-directory
level: Intermédiaire
duration: 25
tags: ["PowerShell", "Active Directory", "Groupes", "Windows Server"]
cover: images/powershellgroupe_cover.png
author: "Panariello Matteo"
---

# Administration des groupes Active Directory en PowerShell

## I/ Groupe

### 1 Créer et Supprimer un groupe

#### 1.1 Création d'un groupe

Pour créer un groupe dans AD il faudra utiliser le cmdlet `New-ADGroup`. Et puis spécifier les paramètre suivant :

- `Name` = Nom du groupe
- `Path` = L'OU dans laquelle on souhaite créer ce groupe
- `GroupScope` = L'étendue du groupe (domaine local / globale / universelle)
- `Description` = La description de votre groupe

```powershell
New-ADGroup -Name "gr_SLAM" -Path "OU=BTS SIO SLAM,OU=ETUDIANTS,DC=DOMCOR,DC=LAN" -GroupScope Global -Description "BTS slam"
```

#### 1.2 Supprimer un groupe

Pour maintenant supprimer un groupe, il faudra utiliser le cmdlet `Remove-ADGroup`. Et simplement spécifier son nom, et si vous voulez passer l'étape de confirmation utiliser `-Confirm:$false`.

```powershell
Remove-ADGroup -Identity "gr_slam2" -Confirm:$false
```

### 2 Modification d'un groupe

#### 2.1 Renommage d'un groupe

Pour renommer un groupe vous devez utiliser le cmdlet `Rename-ADObject`. Puis spécifier le nom actuel `gr_SLAM` et le `-NewName` `gr_SLAM2`. La commande changera automatiquement le `DisplayName` et le `SamAccountName`.

```powershell
Rename-ADObject -Identity "gr_SLAM" -NewName "gr_SLAM2"
```

#### 2.2 Modification de la description

Pour la modification de la description utiliser le cmdlet `Set-ADGroup` et spécifier le groupe et la nouvelle description.

```powershell
Set-ADGroup -Identity "gr_BTS" -Description "Groupe avec les membres du BTS SIO SISR"
```

#### 2.3 Changement du type de groupe et étendue

Nous allons dans un premier temps définir les différents types de groupes qu'il existe, puis les différentes étendues.

| Etendue de groupe | Type de groupe |
| --- | --- |
| Domaine local | Sécurité |
| Globale | Distribution |
| Universelle | - |

##### 2.3.1 Modification Type de groupe

Vous utiliserez le cmdlet `Set-ADGroup`. Puis la commande `-GroupCategory` et choisir entre `Security` ou bien `Distribution`.

En voici un exemple :

```powershell
Set-ADGroup -Identity "Étudiants" -GroupCategory Distribution
```

##### 2.3.2 Modification étendue

Maintenant pour l'étendue vous utiliserez aussi le cmdlet `Set-ADGroup`. Puis la commande `-GroupScope` et choisir entre Domaine local, Global, Universelle.

> **Attention :** Un groupe d'étendue « Globale » ne peut pas être modifié en groupe d'étendue « Domaine local » (il faut d'abord le mettre en étendue universelle, ce qui va nécessiter d'utiliser deux commandes).

Voici un exemple :

```powershell
Set-ADGroup -Identity "Mailing" -GroupScope Universal
```

### 3 Récupération information d'un groupe

#### 3.1 Récupération propriété d'un groupe

La commande qui permet d'obtenir les informations d'un groupe spécifique dans Active Directory en utilise pour ce faire, le cmdlet `Get-ADGroup` avec le paramètre `-Identity` suivi du nom du groupe.

```powershell
Get-ADGroup -Identity "gr_BTS"
```

Il est possible d'affiner les propriété afficher à l'aide de `-Properties` pour préciser les propriétés additionnelles à afficher comme `Description`, `Members`.

#### 3.2 Récupération membres d'un groupe

La commande pour obtenir la liste des membres d'un groupe spécifique, utilise le cmdlet `Get-ADGroupMember` pour récupérer les membres du groupe, puis pipe les résultats à `Format-Table` pour afficher uniquement les colonnes `Name` et `DistinguishedName`.

```powershell
Get-ADGroupMember -Identity "gr_BTS" | Format-Table Name, DistinguishedName
```

#### 3.3 Compter le nombre d'utilisateurs d'un groupe

Pour compter le nombre de membres d'un groupe spécifique, il faut utiliser le cmdlet `Get-ADGroupMember` pour récupérer les membres du groupe, puis accéder à la propriété `Count` pour obtenir le nombre total de membres du groupe.

```powershell
(Get-ADGroupMember -Identity "gr_BTS").Count
```

#### 3.4 Récupération des groupes vides

La commande utilise le cmdlet `Get-ADGroup` pour récupérer tous les groupes Active Directory, en incluant les propriétés des membres. Ensuite, elle utilise le pipeline (`|`) pour passer les résultats à la commande `Where-Object`, qui filtre les groupes pour ne conserver que ceux qui n'ont pas de membres à l'aide de `{ -not $_.members}`. Enfin, elle utilise `Select-Object` pour sélectionner uniquement le nom de ces groupes. Ainsi, la commande retourne une liste des noms des groupes Active Directory qui ne contiennent aucun membre.

```powershell
Get-ADGroup -Filter * -Properties Members | Where-Object { -not $_.members} | Select-Object Name
```
