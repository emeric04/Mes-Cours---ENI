# Démarrage du système

GRUB2, noyau et cibles systemd

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Chaîne de démarrage

Le microprogramme lance GRUB2, qui charge le noyau et son initramfs ; systemd démarre ensuite les services.

```bash
uname -r
ls -lh /boot
ls /boot/loader/entries/
```

- Ne pas modifier directement /boot/grub2/grub.cfg.
- Ne jamais effacer le noyau actuellement utilisé.

## Cibles systemd

graphical.target lance l'interface graphique ; multi-user.target démarre en mode texte ; rescue.target sert à la maintenance.

```bash
systemctl get-default
sudo systemctl set-default multi-user.target
sudo systemctl set-default graphical.target
```

- Changer la cible par défaut modifie les prochains démarrages.
- Prévoir une connexion locale pour les tests en mode console.

## Services

systemctl permet d'inspecter, démarrer, arrêter, activer et désactiver des unités.

```bash
systemctl status sshd
systemctl is-enabled firewalld
systemctl list-units --type=service
```

