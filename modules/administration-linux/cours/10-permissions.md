# Droits sur les fichiers

chmod, chown, umask et droits spéciaux

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Comprendre rwx

Les droits se répartissent entre utilisateur propriétaire, groupe et autres. Sur les répertoires, x autorise la traversée.

```bash
ls -ld /tmp
stat /etc/passwd
umask
```

- r=4, w=2, x=1 en notation octale.

## Modifier les droits

chmod change les permissions ; chown change le propriétaire et/ou le groupe.

```bash
chmod 750 dossier
chown utilisateur:groupe dossier
chmod g+w dossier
```

- L'option -R modifie récursivement : à utiliser avec prudence.
- Les droits spéciaux SetUID, SetGID et sticky bit répondent à des usages distincts.

