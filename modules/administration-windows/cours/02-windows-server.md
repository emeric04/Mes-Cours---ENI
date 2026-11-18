# Gestion de Windows Server

_Source : Cours, diapositives 9–22 ; TP01. Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## Éditions (repères du support Windows Server 2022)
| Édition | Public | Virtualisation Hyper-V (repère du support) |
|---|---|---|
| Essentials | Petite entreprise ; 25 utilisateurs ou 50 périphériques | 1 VM Essentials |
| Standard | Besoins standards ; CAL | 2 VM sous les conditions de licence |
| Datacenter | Forte virtualisation ; CAL | Nombre de VM Windows Server illimité sous les conditions de licence |

Pour un achat ou un audit de licence, vérifier les conditions Microsoft applicables : ces repères ne constituent pas un calcul de licences.

## Mode d'installation
| Expérience de bureau | Server Core |
|---|---|
| Interface graphique locale | Interface locale minimale |
| Consoles accessibles directement | Administration distante ou en commande |
| Plus de ressources | Empreinte et surface d'attaque réduites |
Le choix s'effectue à l'installation ; ne pas compter sur une conversion directe entre modes.

## Configuration initiale
- Nom d'hôte et suffixe DNS ; adressage IP cohérent ; vérifier l'existant.
- Gestionnaire de serveur : rôles et fonctionnalités.
- MMC et RSAT : administration locale ou distante.
- Windows Admin Center (WAC) : console web HTTPS.
- PowerShell : automatisation ; CMD : commandes historiques.

## Surveillance
| Outil | Action |
|---|---|
| Ctrl + Maj + Échap | Gestionnaire des tâches ; processus, CPU, RAM, disque, réseau |
| resmon | Moniteur de ressources ; détail par processus |
| perfmon | Compteurs, collecte planifiée, rapports |
| eventvwr.msc | Journaux Windows et événements de rôles |

| Journal | Contenu |
|---|---|
| Application | Applications |
| Sécurité | Audit |
| Système | Système d'exploitation |
| Journaux dédiés | Rôles/services |
Vues personnalisées, abonnements et tâches sur événement sont disponibles.

## Commandes de contrôle (compléments pratiques)
~~~powershell
hostname
Get-NetIPConfiguration
Get-Service
Get-WinEvent -LogName Application -MaxEvents 30
~~~
## Réflexe terrain
- Définir des compteurs de référence avant d'ajouter un rôle.
- Lors d'un incident : comparer CPU, mémoire, disque, réseau, puis examiner les événements à l'heure du problème. Ne pas déduire la cause d'une seule métrique.
