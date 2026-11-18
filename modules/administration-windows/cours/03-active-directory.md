# Domaine Active Directory

_Source : Cours, diapositives 23–83 ; TP02–03. Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## Du groupe de travail au domaine
| Workgroup | Domaine AD DS |
|---|---|
| Comptes locaux SAM | Authentification centralisée |
| Gestion machine par machine | Comptes, groupes, GPO et délégations centralisés |
| Petite installation | Administration à l'échelle d'une organisation |

AD s'appuie notamment sur TCP/IP, DNS, LDAP et Kerberos ; la synchronisation horaire est importante pour l'authentification. DHCP peut faciliter l'adressage.

## Structure logique et données
| Élément | Rôle |
|---|---|
| Forêt | Schéma et catalogue global communs ; ensembles de domaines |
| Arbre | Hiérarchie de domaines partageant un espace de noms DNS |
| Domaine | Annuaire et périmètre d'administration |
| OU | Organisation des objets, GPO et délégation |
| Objet | Utilisateur, groupe, ordinateur, etc. |
- Partitions : domaine (objets), schéma (classes/attributs), configuration (sites, services) et partitions applicatives dont DNS intégré.
- Le catalogue global (GC) fournit une vue à l'échelle de la forêt ; il contient notamment un sous-ensemble des attributs des objets des autres domaines et facilite recherches et ouverture de session.
- Les conteneurs natifs (Builtin, Computers, System, Users) sont distincts des OU créées par l'administrateur.

## Contrôleurs de domaine
| Composant | Fonction |
|---|---|
| AD DS | Authentification et annuaire |
| NTDS | Base AD ; C:\Windows\NTDS |
| SYSVOL | Fichiers des stratégies/scripts ; C:\Windows\SYSVOL |
| DC inscriptibles | Réplication multimaître |
| RODC | Copie en lecture seule ; réplication entrante et stratégie de cache des mots de passe |
Le RODC convient notamment à un site où la sécurité physique est plus faible. Le GC se configure lors de la promotion ou dans les propriétés NTDS Settings.

## Les cinq rôles FSMO
| Rôle | Portée | Utilité |
|---|---|---|
| Schema Master | Forêt | Écriture du schéma |
| Domain Naming Master | Forêt | Ajout/suppression de domaines et partitions |
| PDC Emulator (CDP) | Domaine | Temps, traitement prioritaire des changements de mot de passe, référence d'administration GPO |
| RID Master | Domaine | Distribue des plages de RID pour les SID |
| Infrastructure Master | Domaine | Références inter-domaines |
Transférer un rôle si son détenteur est joignable ; saisir le rôle uniquement en situation de récupération, avec procédure de retrait du détenteur perdu. Dans le TP, RID et PDC passent à CD2.

~~~powershell
netdom query fsmo
Get-ADForest | Select-Object *Master
Get-ADDomain | Select-Object PDCEmulator,*Master
~~~

## Déploiement d'un domaine
- Nom et IP statiques ; DNS approprié ; installation AD DS ; choisir le scénario et le niveau fonctionnel.
- Nouvelle forêt, nouveau domaine dans une forêt ou DC supplémentaire : ne pas confondre.
- Windows Server 2022 est compatible avec les niveaux fonctionnels 2016 et 2012 R2 présentés p. 52 ; il ne peut pas être DC d'un domaine au niveau 2025.
- Avant dépromotion : vérifier FSMO, autres DNS et GC, état de réplication.

~~~powershell
# Installation du role
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
# Simulation/prerequis du TP
Test-ADDSForestInstallation -DomainName "domED.ad"
# Commandes de promotion (modifier uniquement dans le lab)
Install-ADDSForest -DomainName "domED.ad"
# Depuis CD2, avec DNS et droits corrects
Install-ADDSDomainController -DomainName "domED.ad"
~~~
Les assistants demandent le secret DSRM ; ne jamais l'inscrire dans le dépôt. Promotion et dépromotion peuvent redémarrer un serveur. Commande de dépromotion : Uninstall-ADDSDomainController.

## Utilisateurs, groupes et ordinateurs
| Type / étendue | Usage |
|---|---|
| Sécurité | Attribution des permissions |
| Distribution | Listes de messagerie |
| Global | Membres du même domaine ; groupe de service |
| Universel | Membres éligibles de différents domaines de la forêt |
| Domaine local | Autorisations sur les ressources de son domaine |
| Local machine | Droits sur la machine uniquement |
Les ordinateurs membres s'authentifient via un canal sécurisé. Préparer les objets ou réinitialiser le canal si nécessaire ; préparer les clones avec Sysprep avant déploiement.

~~~powershell
Import-Module ActiveDirectory
Get-ADUser -Identity dgrenier -Properties *
Get-ADUser -Filter {Enabled -eq $false}
Get-ADGroup -Filter {GroupScope -eq "Global"}
Get-ADGroupMember -Identity "G-Informatique"
Get-ADOrganizationalUnit -Filter *
Get-ADComputer -Filter *
~~~
New-ADUser / Set-ADUser : création/modification. New-ADGroup / Set-ADGroup / Add-ADGroupMember : gestion des groupes. Export-Csv et Import-Csv : préparer et valider un modèle avant import en masse.

## Sites et réplication
- Un site représente une topologie réseau (pas une OU). Associer les sous-réseaux IP aux sites.
- Intrasite : réplication rapide ; intersite : liens, coûts et horaires configurables.
- Le KCC (Knowledge Consistency Checker) construit la topologie via les objets connexion.
- Dans le lab : Siege (192.168.0.0/16) et Agence (172.16.0.0/16), sans DC à l'agence à ce stade.

~~~cmd
nltest /dsgetsite
nltest /dsgetdc:domED.ad /force
repadmin /replsummary
repadmin /showrepl
dcdiag /test:dns
~~~
Pour agir sur la réplication : repadmin /replicate, /syncall, /kcc (à utiliser avec discernement). Le site retourné par nltest est celui de la machine où la commande s'exécute.

## Consoles utiles
| Console | Usage |
|---|---|
| dsa.msc | Utilisateurs, ordinateurs, groupes, OU |
| dsac.exe | Centre d'administration AD |
| dssite.msc | Sites, subnets, réplication |
| domain.msc | Domaines, approbations, niveau fonctionnel |
| dnsmgmt.msc | DNS |
