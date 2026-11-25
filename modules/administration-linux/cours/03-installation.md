# Installer un système Linux

VM graphique, serveur et partitionnement

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Préparer l'installation

Choisir une image compatible x86_64, la taille du disque, la mémoire et le mode de connexion réseau dans VMware Workstation.

```bash
lsblk -f
df -hT
```

- Installer une VM avec interface graphique et une VM sans interface graphique pour comparer l'administration.

## Partitionnement

Séparer le système de fichiers racine /, le swap et /boot ; LVM permet ensuite une organisation souple des volumes.

```bash
lsblk
findmnt /boot
swapon --show
```

- Le disque virtuel peut apparaître sous /dev/nvme0n1 ou /dev/sda selon le contrôleur.

