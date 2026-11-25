# Introduction

Se repérer dans le système GNU/Linux

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Objectif

Comprendre les différences entre les tâches exécutées par un utilisateur standard et celles réservées à l'administrateur.

```bash
id
whoami
cat /etc/os-release
```

- Le prompt $ représente généralement une session standard, # une session privilégiée.
- Préférer une élévation de privilèges limitée aux opérations nécessaires.

## Repères

La distribution utilisée en atelier est Oracle Linux 8 ; elle appartient à la famille Red Hat Enterprise Linux (RHEL).

```bash
uname -r
hostnamectl
```

- Les commandes des supports peuvent nécessiter une adaptation à la distribution et à sa version.

