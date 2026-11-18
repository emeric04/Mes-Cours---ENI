# Mes Cours – ENI

Base documentaire personnelle ASR. Un dépôt, un dossier par module.

- [Accueil du portail](index.html)
- [Administration Windows et AD](modules/administration-windows/index.html)
- [Scripts PowerShell](modules/administration-windows/scripts/README.md)

## Organisation

```
index.html
assets/
modules/administration-windows/
  index.html
  cours/       # 5 chapitres HTML + Markdown
  tp/          # 5 ateliers, comptes rendus, corrections, livrables
  fiches/      # commandes, raccourcis, infrastructure
  scripts/     # 5 scripts PowerShell
  modeles/     # modèles réutilisables
```

## Utilisation

Cloner ou télécharger le dépôt puis ouvrir index.html dans le navigateur (pas de build, ni dépendance). Pour GitHub Pages, vérifier Settings > Pages, Deploy from a branch, main / (root), si la visibilité et le plan l'autorisent. Un dépôt privé et un site Pages ne garantissent pas la même confidentialité : vérifier les règles de publication avant activation.

## Sources

Synthèses personnelles à partir du support Administration Windows et AD (ASR02–02, 145 diapositives), TP01–TP05 (2026-09) et fiche raccourcis Windows administration réseau. Le domaine domED.ad est une adaptation du lab. Les exemples, procédures proposées et avertissements ne sont pas une correction officielle. Les PDF originaux, mots de passe de TP et résultats sensibles ne sont pas versionnés. Aucun test Windows exécuté à distance.

Pour ajouter un module, créer un dossier sous modules/ et lier sa page d'accueil depuis index.html. Après modification d'un fichier Markdown, mettre à jour la page HTML correspondante.
