# Maintenance et supervision

Journaux, processus et état du système

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Journaux

journald enregistre les événements système ; rsyslog peut écrire dans des fichiers de log.

```bash
journalctl -b
journalctl -u sshd
journalctl -p err -b
journalctl -f
```

- Les réglages de persistance et de rotation dépendent de la configuration du système.

## Ressources

Observer l'utilisation de la RAM, des processeurs, des processus et des disques.

```bash
top
free -h
ps -ef
pgrep -a sshd
df -hT
lscpu
```

- Croiser les métriques et les journaux avant d'attribuer une panne à une cause.

