# Mode maintenance

Maintenance ponctuelle depuis GRUB

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Démarrage temporaire

Dans GRUB, sélectionner le noyau, appuyer sur e, ajouter single à la ligne linux, puis démarrer avec Ctrl+X.

- L'édition de GRUB au démarrage n'est pas une modification persistante.
- Le mot de passe root peut être demandé.

## Retour à la normale

Si la cible par défaut a été modifiée pendant un TP, rétablir le démarrage graphique avant de redémarrer.

```bash
systemctl get-default
systemctl set-default graphical.target
systemctl reboot
```

- Utiliser les procédures de récupération avec précaution : SELinux et les systèmes de fichiers doivent rester cohérents.

