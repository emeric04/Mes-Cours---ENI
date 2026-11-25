# Atelier 3 — Démarrage en mode maintenance

Tester les cibles de démarrage et GRUB

**Guide personnel, non corrigé officiel.**

## Déroulement
1. Vérifier graphical.target sur le poste graphique.
2. Passer en multi-user.target et redémarrer en console.
3. Tester rescue.target et l'accès root.
4. Revenir à graphical.target.
5. Passer temporairement en mode maintenance depuis GRUB.

## Commandes utiles
```bash
systemctl get-default
systemctl set-default multi-user.target
systemctl set-default rescue.target
systemctl set-default graphical.target
```

## À prouver
Captures des cibles, des écrans console/Rescue et de GRUB.

Voir [le cours associé](../../cours/02-historique.md).
