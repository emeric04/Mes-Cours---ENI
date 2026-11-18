# TP 01 — Création de l’infrastructure

_Source : TP01 — énoncé, p. 1–4. Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## Préparer le lab
- VMware Workstation et accès aux ISO fournis.
- Stocker chaque VM dans un dossier distinct sur D: ; réseau host-only.
| Machine | OS | CPU / RAM / disque | IP |
|---|---|---|---|
| CD1 | Windows Server 2022 | 1 / 4 Go / 40 Go | 192.168.21.1/16 |
| SRV1 | Windows Server 2022 | 1 / 2 Go / 40 Go | 192.168.21.10/16 |
| Win-CL1 | Windows 11 | 1 / 4 Go / 40 Go | 192.168.21.20/16 |
Win-CL1 est aussi noté W11-CL1 dans l'énoncé. Les configurations effectives peuvent être différentes, les renseigner dans le compte rendu.

## Collecte de performances sur CD1
- perfmon : créer un ensemble de collecteurs défini par l'utilisateur (compteurs).
- CPU : temps d'utilisation et d'inactivité ; mémoire : Mo disponibles et pages/s ; disque : latences lecture/écriture, temps actif et inactif.
- Cible C:\PerfLogs ; nom CompteurBase-AAMMJJ (date automatique).
- Démarrage à +30 min, durée 10 min, répétition quotidienne jusqu'au vendredi.
- Consulter ensuite Rapports et vérifier les valeurs.

## WAC et administration distante
- Installer le MSI fourni sur SRV1 ; suivre les paramètres de l'assistant.
- Accéder à https://srv1:443 ; attention, schéma p. 2 indique 6516 alors que texte p. 3 impose 443 : vérifier le port réellement installé.
- Activer RDP sur SRV1 depuis WAC, tester depuis Win-CL1 et ajouter CD1 à WAC.
- Rechercher l'installation WAC dans l'Observateur d'événements ; relever date, heure, version.
~~~cmd
ipconfig /all
ping 192.168.21.1
perfmon
eventvwr.msc
mstsc
~~~
## Livrables
- [ ] Trois VM, IP et réseau corrects.
- [ ] Collecteur et planification documentés ; rapport de mesures.
- [ ] WAC opérationnel, RDP testé et CD1 ajouté.
- [ ] Trace d'installation WAC (date, heure, version).
