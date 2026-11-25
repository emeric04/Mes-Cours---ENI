# Commandes Linux essentielles

## Système et services

Vérifier l'état de la machine et des unités systemd.

```bash
cat /etc/os-release
uname -r
hostnamectl
systemctl status sshd
systemctl get-default
```

## Réseau

Inspecter interfaces, routage et résolution.

```bash
ip a
ip r
nmcli connection show
cat /etc/resolv.conf
```

## Paquets

Gérer les RPM et leurs mises à jour.

```bash
dnf repolist
dnf provides '*/day.jpg'
dnf check-update
dnf history info last
```

## Stockage et fichiers

Comprendre les disques et l'utilisation des volumes.

```bash
lsblk -f
blkid
findmnt
df -hT
du -sh /var
```

## Comptes et permissions

Contrôler identité, groupes et droits.

```bash
id
getent passwd
getent group
ls -l
stat /etc/passwd
umask
```

## Journalisation

Chercher la cause d'un incident.

```bash
journalctl -b
journalctl -u sshd
journalctl -p err -b
free -h
top
```

