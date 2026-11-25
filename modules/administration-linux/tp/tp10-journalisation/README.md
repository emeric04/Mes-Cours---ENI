# Atelier 10 — Gestion de la journalisation

Journald, rsyslog et rotation

**Guide personnel, non corrigé officiel.**

## Déroulement
1. Identifier les services et fichiers de journaux.
2. Filtrer les événements par service ou niveau.
3. Examiner la configuration de conservation selon l'énoncé.

## Commandes utiles
```bash
journalctl -b
journalctl -u sshd
journalctl -p err
systemctl status rsyslog
```

## À prouver
Preuve d'un filtre journalctl, emplacement des journaux et réglages observés.

Voir [le cours associé](../../cours/07-paquets.md).
