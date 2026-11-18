# Accès aux ressources

_Source : Cours, diapositives 84–115 ; TP04 (stockage en complément). Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## Autorisations NTFS
- Les ACL contiennent des entrées (ACE) pour les identités de sécurité (SID).
- Accorder les droits aux groupes plutôt qu'aux comptes individuels.
- Les droits accordés se cumulent ; un refus explicite sur un droit est prioritaire sur une autorisation explicite correspondante. Tenir compte de l'héritage et des droits spéciaux.
| Droit de base | Usage |
|---|---|
| Lecture | Lire les fichiers |
| Lecture et exécution | Lire et lancer |
| Liste du dossier | Parcourir le contenu |
| Écriture | Créer et écrire |
| Modification | Lire, écrire et supprimer |
| Contrôle total | Modification + gestion des permissions notamment |

## Héritage
| Opération | Même volume NTFS | Autre volume |
|---|---|---|
| Copie | Hérite de la destination normalement | Hérite de la destination normalement |
| Déplacement | Conserve généralement ses ACL | Hérite de la destination normalement |
Outils et options de copie peuvent modifier ce comportement. Conserver SYSTEM et administrateurs ; vérifier les droits hérités avant de les désactiver.

## Partages SMB
| Partage | NTFS | Résultat réseau |
|---|---|---|
| Lecture | Contrôle total | Lecture |
| Contrôle total | Modification | Modification |
| Modification | Lecture | Lecture |
> Droits effectifs réseau = intersection des autorisations de partage et NTFS. Un partage masqué ($) n'est pas une protection.

~~~powershell
Get-SmbShare
Get-SmbShareAccess -Name "Documentation"
Get-Acl -LiteralPath "E:\DATA\Documentation" | Format-List
~~~
New-SmbShare, Set-SmbShare, Remove-SmbShare : gestion des partages. Un chemin UNC s'écrit \\SRV1\Documentation.

## AGDLP
A (comptes) → G (groupes globaux de service) → DL (groupes de domaine local par ressource/droit) → P (permissions).
- Global : qui est la personne ? DL : à quelle ressource peut-elle accéder ?
- Exemple : Christelle → G-Comptabilité → DL-Compta-Modification → ACL du dossier Compta.
- Les permissions sont affectées aux DL ; vérifier aussi les groupes imbriqués.

## Stockage résilient (TP04)
- Pool : agrège des disques physiques. Disque virtuel : capacité + résilience. Volume : système de fichiers et montage.
- Miroir à deux voies : deux copies, tolérance à la perte d'un disque si état sain ; ce n'est pas une sauvegarde.
- Trois disques SCSI de 20 Go sur SRV1 ; DATA 10 Go NTFS E:\ ; USERS 5 Go NTFS C:\Base.
~~~powershell
Get-StoragePool -IsPrimordial $false
Get-PhysicalDisk
Get-VirtualDisk | Select-Object FriendlyName,HealthStatus,ResiliencySettingName,NumberOfDataCopies,PhysicalDiskRedundancy
Get-Volume
Get-Partition | Select-Object DiskNumber,DriveLetter,AccessPaths
~~~

## Impression
| Concept | Fonction |
|---|---|
| Périphérique d'impression | Matériel physique |
| Imprimante | Objet logique associé au port/pilote |
| Serveur d'impression | Centralise files, pilotes, ports et partages |
| Droits | Imprimer, gérer les documents, gérer l'imprimante |
Déploiement manuel, script ou GPO. Plusieurs files peuvent utiliser le même périphérique ; utile pour des créneaux d'impression différents.

## Délégation AD
- Définir qui, quelle tâche, quelle OU ; appliquer le moindre privilège.
- ADUC → clic droit sur OU → Délégation de contrôle → groupe → tâches.
- Mettre à disposition RSAT ou une MMC personnalisée pour l'opérateur.
- Tester avec son compte : opération autorisée dans l'OU, opération refusée hors périmètre.
