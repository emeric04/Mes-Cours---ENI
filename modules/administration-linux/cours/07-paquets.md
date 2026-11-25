# Gestion des paquets

DNF, dépôts RPM et compilation

> Notes de cours ENI (2021-11), reformulées et adaptées à Oracle Linux 8.

## Rechercher et installer

DNF consulte les dépôts configurés et résout les dépendances des paquets RPM.

```bash
dnf repolist
dnf search vim
dnf info vim-enhanced
dnf provides '*/day.jpg'
dnf install vim-enhanced
```

## Mettre à jour

Vérifier les mises à jour disponibles, agir sur un paquet ou sur l'ensemble du système, puis consulter l'historique.

```bash
dnf check-update
dnf upgrade
dnf history
dnf history info last
```

- La colonne « Modifié » de dnf history comprend aussi des installations ; vérifier le détail.

## Noyaux et dépôts

L'origine enregistrée d'un paquet peut être @anaconda (média d'installation) ou @nom_du_depot.

```bash
rpm -q kernel kernel-core kernel-uek
dnf list installed 'kernel*'
uname -r
df -h /boot
```

- Sur Oracle Linux, le noyau UEK et le noyau RHCK peuvent coexister.
- Ne pas supprimer le noyau actif ni supprimer manuellement les initramfs.

## Compiler depuis les sources

Installer les outils et bibliothèques de développement, puis compiler en utilisateur non privilégié.

```bash
git clone https://github.com/vim/vim.git
cd vim/src
make
./vim --version
```

- Pour le bonus de l'atelier : ne pas exécuter make install.
- Vérifier les dépendances et lire les consignes du projet avant compilation.

