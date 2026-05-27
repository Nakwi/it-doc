---
title: "Introduction et fondamentaux de PowerShell"
category: powershell
subcategory: active-directory
level: Débutant
duration: 30
tags: ["PowerShell", "Windows", "Cmdlets", "Pipeline", "Scripting"]
cover: images/powershellfondamentaux_cover.png
author: "Panariello Matteo"
---

# Introduction et fondamentaux de PowerShell

## Introduction

### 1 PowerShell

PowerShell est un puissant langage de script et une interface en ligne de commande développé par Microsoft. Il a été initialement introduit en 2006 pour les administrateurs système afin de simplifier et d'automatiser les tâches de gestion dans les environnements Windows.

Contrairement à l'ancienne interface en ligne de commande (CLI) de Windows, PowerShell est basé sur le framework .NET, ce qui lui confère une grande flexibilité et une capacité à interagir avec un large éventail de services et de technologies Microsoft.

### 2 Pourquoi utiliser PowerShell pour administrer un système

PowerShell offre de nombreux avantages pour l'administration système :

- **Automatisation** : il permet d'automatiser des tâches répétitives et complexes, ce qui permet de gagner du temps et d'améliorer l'efficacité opérationnelle.
- **Gestion centralisée** : PowerShell peut gérer à la fois des tâches locales et des tâches sur des systèmes distants, offrant ainsi une gestion centralisée des infrastructures.
- **Interopérabilité** : il peut interagir avec un large éventail de technologies Microsoft telles que Active Directory, Exchange, SharePoint, etc., ainsi qu'avec des services tiers via des API.
- **Scripting avancé** : PowerShell est un langage de script complet avec des structures de contrôle, des fonctions, des modules, des variables, et plus encore, ce qui le rend adapté aux besoins les plus avancés des administrateurs système.

### 3 Historique et évolution de PowerShell

Depuis sa première version, PowerShell a connu plusieurs itérations majeures, chaque nouvelle version apportant des fonctionnalités améliorées et des améliorations de performances. Voici un bref aperçu de l'évolution de PowerShell :

- **PowerShell 1.0** : lancé en 2006, il introduit le langage de script PowerShell basé sur .NET.
- **PowerShell 2.0** : intégré à Windows 7 et Windows Server 2008 R2, il apporte de nouvelles fonctionnalités telles que les modules, l'extension de l'API WMI, etc.
- **PowerShell 3.0** : lancé en 2012, il inclut des améliorations majeures telles que Workflow, Remote Scripting, etc.
- **PowerShell 4.0 et 5.0** : introduisent des fonctionnalités avancées telles que Desired State Configuration (DSC), PowerShell Gallery, etc.
- **PowerShell 7.x** : version multiplateforme compatible avec Windows, macOS et Linux, offrant une compatibilité accrue avec les environnements cloud et hybrides.

PowerShell continue d'évoluer avec de nouvelles versions et fonctionnalités, en restant un outil essentiel pour les administrateurs système modernes.

## Fondamentaux de PowerShell

PowerShell repose sur une syntaxe et des concepts particuliers qui sont essentiels pour bien comprendre et utiliser efficacement cet outil d'administration système. Cette section couvrira les aspects fondamentaux de PowerShell, y compris sa syntaxe de base, les commandes essentielles et la gestion des variables, et ses opérateurs de comparaison.

### 1 Syntaxe de base

#### 1.1 Cmdlets

Les cmdlets sont les éléments fondamentaux de PowerShell. Ils suivent un format standard **Verbe-Nom** (par exemple `Get-Process`, `Set-Item`, `Remove-Item`).

- **Verbe** : il indique l'action à effectuer (comme `Get` pour obtenir des informations, `Set` pour définir des valeurs, `Remove` pour supprimer des éléments, etc.).
- **Nom** : il spécifie l'objet sur lequel l'action doit être effectuée (comme `Process` pour les processus, `Item` pour les éléments, `Service` pour les services, etc.).

Exemples de cmdlets courants :

- `Get-Process` : récupère des informations sur les processus en cours d'exécution.
- `Get-Service` : obtient des informations sur les services du système.
- `New-Item` : crée un nouvel élément (fichier, dossier, registre, etc.).
- `Set-ItemProperty` : définit les propriétés d'un élément.
- `Remove-Item` : supprime un élément.

#### 1.2 Pipeline

Le pipeline (`|`) permet de chaîner des **cmdlets** ensemble en transmettant la sortie d'une commande comme entrée à une autre. Cela permet de construire des **séquences de commandes** complexes et de manipuler les données de manière fluide.

Par exemple :

```powershell
Get-Service | Where-Object { $_.Status -eq "Running" } | Stop-Service
```

Dans cet exemple, `Get-Service` récupère tous les services, `Where-Object` filtre ceux qui sont en cours d'exécution, puis `Stop-Service` les arrête.

#### 1.3 Gestion des variables

Les variables permettent de **stocker** et de **manipuler** des données dans PowerShell. Elles commencent toujours par le symbole `$` suivi du nom de la variable.

Exemple :

```powershell
$nom = "Angéleau Vasqueezie"
```

On peut ensuite utiliser cette variable dans des cmdlets ou des scripts pour référencer la donnée qu'elle contient.

#### 1.4 Structures de contrôle

PowerShell offre plusieurs structures de contrôle pour gérer le flux d'exécution dans les scripts.

##### Boucles

- **for** : exécute des instructions un nombre spécifié de fois.
- **foreach** : parcourt chaque élément dans une collection.
- **while** : exécute des instructions tant qu'une condition est vraie.

Exemple boucle **foreach** :

```powershell
$Animaux = "Chat", "Chien", "Poisson"
foreach ($Animal in $Animaux) {
    Write-Host "Animal : $Animal"
}
```

Ce script va afficher le nom des trois animaux, car il aura parcouru toute la liste.

##### Instructions conditionnelles

- **if / else** : exécute des instructions en fonction d'une condition.
- **switch** : exécute des instructions basées sur la correspondance avec différentes valeurs.

Exemple d'utilisation de **if** :

```powershell
$nombre = 10
if ($nombre -gt 5) {
    Write-Host "Le nombre est supérieur à 5."
} else {
    Write-Host "Le nombre est inférieur ou égal à 5."
}
```

#### 1.5 Opérateurs de comparaison

Dans PowerShell, les **opérateurs de comparaison** sont utilisés pour effectuer des **comparaisons** entre des valeurs et sont essentiels pour des opérations telles que le **filtrage** et les **conditions**.

Voici un récapitulatif des opérateurs de comparaison les plus couramment utilisés :

| Opérateur | Description |
| :---: | :--- |
| `-gt` | Plus grand que |
| `-ge` | Plus grand ou égal à |
| `-eq` | Égal à |
| `-ne` | Différent de |
| `-lt` | Plus petit que |
| `-le` | Plus petit ou égal à |

Ces opérateurs sont utilisés en corrélation avec d'autres cmdlets pour filtrer des données ou dans des instructions conditionnelles.

Par exemple :

```powershell
Get-ADDomainController -Filter { name -eq "SRV-1" }
```

Ici, on utilise l'opérateur `-eq` pour **filtrer** et que la commande s'effectue seulement sur la machine ayant un nommage **égal à** "SRV-1".
