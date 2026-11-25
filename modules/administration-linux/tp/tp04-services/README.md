# Atelier 4 — Gestion du démarrage et des services

Inspecter SSH et désactiver durablement le pare-feu

**Guide personnel, non corrigé officiel.**

## Déroulement
1. Contrôler l'état du service sshd.
2. Désactiver le service firewalld dans la VM de TP isolée.
3. Compter les lignes « Removed » affichées par systemd.

## Commandes utiles
```bash
systemctl status sshd
systemctl disable --now firewalld
systemctl is-enabled firewalld
```

## À prouver
Capture de sshd et du résultat de disable ; dans le lab observé, 2 liens supprimés.

Voir [le cours associé](../../cours/02-historique.md).
