# Configuration réseau

Adresse IP, routes, DNS et NetworkManager

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Diagnostic

Une configuration de base comprend une adresse IP, un préfixe, une passerelle éventuelle et des serveurs DNS.

```bash
ip a
ip r
cat /etc/resolv.conf
nmcli device status
```

- /etc/resolv.conf peut être généré automatiquement par NetworkManager.

## Configurer

nmtui propose une interface texte ; nmcli permet d'automatiser la configuration.

```bash
nmtui
nmcli connection show
systemctl status NetworkManager
```

- Adapter le nom de la connexion et les IP à la VM avant de modifier les paramètres.

