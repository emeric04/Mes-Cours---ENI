# PowerShell & CMD

_Source : Complément pratique : cours + ateliers + commandes utilisées dans le lab. Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## Active Directory / lecture
~~~powershell
Import-Module ActiveDirectory
Get-ADUser -Filter {Enabled -eq $false}
Get-ADUser -Identity dgrenier -Properties *
Get-ADGroup -Filter {GroupScope -eq "Global"}
Get-ADGroupMember -Identity "G-Informatique"
Get-ADGroupMember -Identity "G-Informatique" -Recursive
Get-ADDomain
Get-ADForest
Get-ADReplicationSubnet -Filter *
Get-ADReplicationSite -Filter *
~~~
Sans -Recursive : membres directs (dont groupes imbriqués). Avec -Recursive : expansion des membres.

## Réseau, DNS, domaine, GPO
~~~cmd
ipconfig /all
ping 192.168.21.1
nslookup domED.ad
nltest /dsgetsite
nltest /dsgetdc:domED.ad /force
netdom query fsmo
repadmin /replsummary
repadmin /showrepl
dcdiag /test:dns
whoami /groups
gpupdate /force
gpresult /r
gpresult /h resultat-gpo.html
~~~

## Stockage, partages et ACL
~~~powershell
Get-Disk
Get-PhysicalDisk
Get-StoragePool -IsPrimordial $false
Get-VirtualDisk
Get-Volume
Get-Partition
Get-SmbShare
Get-SmbShareAccess -Name Documentation
Get-Acl -LiteralPath "E:\DATA\Documentation"
~~~

## Scripting : les bases
| Notion | Utilité |
|---|---|
| Read-Host | Saisie utilisateur |
| -AsSecureString | Mot de passe masqué |
| Write-Host | Affichage terminal |
| $null | Absence de valeur |
| -eq / -ne | Égal / différent |
| if / else | Condition |
| try / catch | Gestion d'erreur |
| -ErrorAction Stop | Transformer une erreur non bloquante en erreur bloquante |
| $_.Exception.Message | Message dans catch |
| foreach | Parcourir une collection |
| do / while | Répéter au moins une fois |
| Select-Object | Sélectionner des propriétés |
| Out-File -Append | Ajouter des lignes à un fichier |
- Le pipe transmet des objets d'une commande à la suivante.
- Une variable contenant le résultat d'une lecture AD n'est pas actualisée automatiquement après une modification.
- Privilégier Get-Help Nom-Commande -Examples et Get-Command Nom-Commande -Syntax.

## Prudence
Les commandes de lecture sont à privilégier pour diagnostiquer. Les commandes de modification doivent être testées sur le lab, avec les droits nécessaires et après vérification des objets/chemins.
