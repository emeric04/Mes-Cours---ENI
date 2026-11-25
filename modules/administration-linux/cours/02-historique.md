# Historique et distributions

RHEL, Fedora, CentOS et Oracle Linux

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Famille RHEL

Fedora est une distribution en amont de l'écosystème Red Hat ; RHEL cible la stabilité des environnements d'entreprise.

- Oracle Linux et Rocky Linux sont des distributions de la même famille.
- Ne pas confondre la version d'une distribution avec celle du noyau.

## Identifier sa machine

Lire les informations réelles avant d'utiliser une commande propre à une distribution.

```bash
cat /etc/os-release
cat /etc/redhat-release
uname -a
```

