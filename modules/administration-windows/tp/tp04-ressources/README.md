# TP 04 — Gestion des ressources

_Source : TP04 — énoncé, p. 1–8. Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## 1 — Stockage sur SRV1
- VM éteinte : ajouter 3 disques SCSI 20 Go ; démarrer, vérifier qu'ils sont détectés. Ne pas initialiser le disque système.
- Gestionnaire de serveur → Services de fichiers et de stockage → Pools de stockage ; créer un pool avec les trois nouveaux disques.
- Créer deux disques virtuels en miroir à deux voies si disponible, puis volumes NTFS.
| Volume | Taille | Accès |
|---|---|---|
| DATA | 10 Go | E:\ |
| USERS | 5 Go | C:\Base (dossier NTFS vide) |
~~~powershell
Get-StoragePool -IsPrimordial $false
Get-VirtualDisk | Select-Object FriendlyName,HealthStatus,ResiliencySettingName,NumberOfDataCopies,PhysicalDiskRedundancy
Get-Partition | Select-Object DiskNumber,DriveLetter,AccessPaths
~~~
Attendu : Healthy, Mirror, 2 copies, redondance 1 ; vérifier avant toute simulation. Ne pas détacher un disque sans sauvegarde ni procédure de récupération.

## 2 — Arborescence et partages
~~~text
E:\DATA
├── Documentation
├── Informatique
└── Services
    └── Comptabilité
~~~
| Partage | UNC | Droits effectifs attendus |
|---|---|---|
| Documentation | \\SRV1\Documentation | Tous lecture, IT total, intérimaires aucun ; publier dans AD |
| Compta | \\SRV1\Compta | Comptabilité modification, IT total, autres aucun |
| Info$ | \\SRV1\Info$ | IT total, autres aucun (masqué) |

## 3 — AGDLP : groupes de domaine local
Cette proposition met en œuvre les droits demandés ; adapter les groupes selon la maquette.
| Groupe DL de sécurité | Membres ou rôle |
|---|---|
| DL-Documentation-Lecture | Utilisateurs du domaine (lecture) |
| DL-Documentation-ControleTotal | G-Informatique |
| DL-Documentation-Refus | G-Intérimaires (refus sur Documentation uniquement) |
| DL-Compta-Modification | G-Comptabilité |
| DL-Compta-ControleTotal | G-Informatique |
| DL-Info-ControleTotal | G-Informatique |
- Appliquer les DL aux ACL de partage et NTFS. Enlever les autorisations larges non souhaitées ; conserver SYSTEM et administrateurs.
- Le refus sur Documentation couvre les intérimaires qui appartiennent aussi aux groupes autorisés ; ne pas refuser « Tout le monde » ni utiliser un refus global sur Compta/Info$.
- Publication AD : créer un objet dossier partagé dans l'OU appropriée avec le chemin UNC (console ADUC, selon affichage/options).
- Après changement de groupes, rouvrir la session de test.
~~~powershell
Get-SmbShare
Get-SmbShareAccess -Name Documentation
Get-SmbShareAccess -Name Compta
Get-SmbShareAccess -Name 'Info$'
~~~

## 4 — Tests depuis Win-CL1
Ce tableau donne les attentes théoriques, pas des observations. Les comptes Ivan/Christophe doivent être activés de manière contrôlée pour les tests qui exigent une connexion, puis remis dans l'état convenu.
| Partage / compte | Action | Attendu | Observé |
|---|---|---|---|
| Documentation / Christophe | Accès | Refus | À compléter |
| Documentation / Christelle | Accès | Autorisé | À compléter |
| Documentation / David | Lecture | Autorisée | À compléter |
| Documentation / Isabelle | Lecture | Autorisée | À compléter |
| Documentation / Christelle | Modification | Refus | À compléter |
| Documentation / Isabelle | Modification | Autorisée | À compléter |
| Compta / Christelle | Accès | Autorisé | À compléter |
| Compta / David | Accès | Refus | À compléter |
| Compta / Christelle | Modification | Autorisée | À compléter |
| Compta / Isabelle | Contrôle total | Autorisé | À compléter |

## 5 — Délégations AD
| Compte | Périmètre | Tâche |
|---|---|---|
| David | Utilisateurs/Comptabilité | Réinitialiser MDP et créer/modifier/supprimer les utilisateurs |
| Ivan | Services hors Informatique | Gérer comptes utilisateurs |
| Isabelle | Annuaire entier | Groupe d'administration natif approprié au lab |
ADUC → clic droit OU → Délégation de contrôle. Pour Ivan, déléguer aux OU voulues plutôt que sur leur parent commun. En production, séparer comptes d'administration et d'usage quotidien.

## 6 — Impression
| Paramètre | Valeur |
|---|---|
| Imprimante | Dell 5210CN |
| IP | 192.168.21.30/16 |
| Port | TCP/IP standard / Generic Network Card |
| Pilote | Dell Open Print PCL 5 (x86 et x64 demandés) |
- Installer le rôle Serveur d'impression ; port, pilote fourni, partage et référencement AD ; tester depuis Win-CL1.
- Tous : imprimer ; Comptabilité : seulement 20 h–06 h ; responsable Comptabilité : gérer les documents/file ; IT : contrôle total.
- Proposition pour les horaires : deux files logiques vers le même port, l'une restreinte à Comptabilité avec disponibilité nocturne, l'autre excluant Comptabilité ; vérifier qu'il n'existe pas de chemin alternatif autorisé. Une impression peut rester en attente hors créneau ; noter le comportement réel.
- Sans imprimante physique, distinguer installation de la file et preuve d'impression effective.

## Livrables
- [ ] Pool, 2 volumes, arborescence et état vérifiés.
- [ ] Partages, AGDLP, publication et tests réels.
- [ ] Délégation testée (David, Ivan, Isabelle).
- [ ] Imprimante partagée, publiée et testée ; horaires et droits.
