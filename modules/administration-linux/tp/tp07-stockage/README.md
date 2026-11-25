# Atelier 7 — Espaces disque et montages

Partitionnement, LVM, systèmes de fichiers

**Guide personnel, non corrigé officiel.**

## Déroulement
1. Identifier les disques et leurs partitions.
2. Préparer un espace de test (ne jamais réutiliser le disque système).
3. Créer les volumes et le système de fichiers demandés par l'énoncé.
4. Monter puis vérifier avant d'ajouter à fstab.

## Commandes utiles
```bash
lsblk -f
fdisk -l
pvs; vgs; lvs
blkid
findmnt
```

## À prouver
Tableau des disques, commandes réalisées et preuves du montage.

Voir [le cours associé](../../cours/04-demarrage.md).
