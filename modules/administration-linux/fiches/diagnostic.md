# Diagnostic et dépannage

## Plus de place sur /boot

Repérer les noyaux actifs avant une suppression via DNF. Conserver un noyau de repli.

```bash
df -hT
uname -r
rpm -q kernel kernel-core kernel-uek
ls -lh /boot
```

- Dans le lab, /boot est passé de 96 % à 70 % après retrait via DNF de deux anciennes versions RHCK et de leurs kernel-core/modules.
- La suppression du méta-paquet kernel seul ne libère pas nécessairement de place.

## Erreur DNF de dépendances

Lire la liste des dépôts et l'origine des paquets. Ne pas forcer --skip-broken sans comprendre l'incohérence.

```bash
dnf repolist
dnf check-update
dnf history
dnf info openssh-askpass
```

- Sur le lab, une incohérence de versions OpenSSH a pu être rencontrée entre BaseOS et AppStream.

## Erreur réseau

Identifier si le blocage vient de l'interface, d'une route ou du DNS.

```bash
ip a
ip r
nmcli device status
cat /etc/resolv.conf
journalctl -u NetworkManager -b
```

