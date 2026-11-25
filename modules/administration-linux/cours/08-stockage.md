# Gestion du stockage

Partitions, LVM, systèmes de fichiers et montages

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Disques et partitions

Une partition NVMe ressemble à /dev/nvme0n1p1 ; sur un contrôleur SCSI/SATA, on trouve souvent /dev/sda1.

```bash
lsblk -f
blkid
fdisk -l
```

- Ne jamais formater une partition qui héberge des données à conserver.

## LVM

Les volumes physiques (PV) alimentent les groupes de volumes (VG), eux-mêmes divisés en volumes logiques (LV).

```bash
pvs
vgs
lvs
lvdisplay
```

- Un agrandissement LVM ne redimensionne pas toujours automatiquement le système de fichiers.

## Montages

Un point de montage rend un système de fichiers accessible dans l'arborescence. /etc/fstab définit les montages persistants.

```bash
findmnt
findmnt /boot
cat /etc/fstab
df -hT
du -sh /var
```

- Sauvegarder /etc/fstab et tester uniquement le nouveau montage avant le redémarrage.

