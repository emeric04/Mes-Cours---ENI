# Utilisateurs et groupes

UID, GID, comptes et privilèges

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Comptes

/etc/passwd décrit les comptes, /etc/shadow les informations d'authentification, /etc/group les groupes.

```bash
id
getent passwd
getent group
getent passwd userasr
```

- Ne jamais publier de copie de /etc/shadow.

## Administrer

Créer un utilisateur et gérer ses groupes secondaires sont des opérations distinctes.

```bash
sudo useradd -m exemple
sudo passwd exemple
sudo usermod -aG wheel exemple
id exemple
```

- Le groupe wheel peut autoriser des opérations sudo selon la configuration locale.
- Ne jamais lancer userdel -r sans vérifier le répertoire personnel concerné.

