# Informations du labo Linux

## Contexte de TP

Oracle Linux Server 8.10 dans VMware Workstation, avec une VM graphique et une VM serveur en console.

```bash
cat /etc/os-release
hostnamectl
lsblk -f
```

- Les exemples de l'interface sont génériques ; les identifiants de machines et adresses IP réelles ne sont pas publiés.

## Versions et dépannage

Exemple observé : noyau UEK 5.15.0-206.153.7.1.el8uek.x86_64, avec des noyaux RHCK 4.18 installés en parallèle.

```bash
uname -r
rpm -q kernel kernel-core kernel-uek
df -h /boot
```

- Le noyau démarré n'est pas forcément le plus récent paquet installé.
- L'ISO d'installation est en lecture seule : son affichage à 100 % dans df est normal.

