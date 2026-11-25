# Stockage : réflexes de sécurité

## Avant une manipulation

Identifier sans ambiguïté le disque visé et son éventuel rôle système.

```bash
lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINTS
findmnt /
pvs
vgs
lvs
```

- NVMe et SCSI sont des protocoles/contrôleurs de stockage ; VMware peut exposer des périphériques via les deux.
- Ne pas exécuter mkfs, fdisk w, pvcreate ou dd sans avoir confirmé la cible.

## Après une modification

Contrôler que les points de montage restent cohérents.

```bash
blkid
findmnt
df -hT
cat /etc/fstab
```

- Pour fstab, valider le nouveau montage sur le point ciblé avant tout redémarrage.

