# Atelier 6 — Installations logicielles

DNF, noyau, mises à jour et compilation

**Guide personnel, non corrigé officiel.**

## Déroulement
1. Identifier l'origine et la version du noyau.
2. Identifier le paquet contenant day.jpg et contrôler ses mises à jour.
3. Effectuer la mise à jour et consulter l'historique.
4. Bonus : compiler VIM sans installation et installer un RPM TurboVNC.

## Commandes utiles
```bash
rpm -q kernel-uek --last
dnf list installed kernel-uek
dnf provides '*/day.jpg'
dnf check-update oracle-backgrounds
dnf history info last
```

## À prouver
Dans un essai du lab : paquet oracle-backgrounds, provenance ol8_baseos_latest ; transaction de 19 modifications = 16 mises à jour et 3 installations.

Voir [le cours associé](../../cours/03-installation.md).
