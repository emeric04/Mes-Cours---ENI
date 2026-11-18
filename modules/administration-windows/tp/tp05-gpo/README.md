# TP 05 — Stratégies de groupe

_Source : TP05 — énoncé, p. 1–9. Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## Méthode pour chaque GPO
Créer → lier à l'OU → configurer → gpupdate /force → rouvrir session si nécessaire → gpresult → tester ciblés/non ciblés.
~~~cmd
gpmc.msc
gpupdate /force
gpresult /r
gpresult /h resultat-gpo.html
~~~

## 1–3 — Ciblage
| GPO | Cible | Paramètres |
|---|---|---|
| GPO-Postes-Commun-Securite | OU Clients | Masquer dernier identifiant, activer pare-feu |
| GPO-Utilisateurs-Direction-Restrictions | OU Utilisateurs/Direction | Bloquer propriétés Ce PC, Certificats MMC, Regedit, Gestionnaire des tâches |
| GPO-Utilisateurs-Interimaires-Restrictions | Filtrage G-Intérimaires | Corbeille masquée ; pas d'animation de bienvenue ; bloquer accès CD/DVD |
- Vérifier David (restriction Direction), Isabelle (pas de restriction Direction), Christophe (restriction intérimaires).
- Si un réglage est uniquement ordinateur, il ne peut pas suivre un utilisateur sur un poste partagé par simple filtrage utilisateur ; vérifier la portée exacte de l'animation de bienvenue et du blocage des médias, documenter limite et solution avec le formateur. Préserver la lecture GPO nécessaire aux ordinateurs.
- Utilisateurs désactivés : prévoir une activation temporaire contrôlée pour les tests puis restaurer l'état convenu.

## 4 — Mot de passe et verrouillage
| Politique domaine | Valeur demandée |
|---|---|
| Longueur minimale | 10 caractères |
| Complexité | Activée |
| Historique | 20 |
| Âge maximal | 30 jours |
GPO-Domaine-Politique-MotsDePasse liée au domaine (ou Default Domain Policy selon procédure). Ces valeurs sont celles du lab.
- PSO dédiée à G-Informatique : 2 tentatives échouées, durée de verrouillage 0 (= déverrouillage administrateur), paramètres restants cohérents avec la politique domaine.
- Centre d'administration AD → System → Password Settings Container ; sélectionner le groupe et vérifier PSO résultante. Effectuer le test avec un compte de laboratoire non critique ; prévoir un compte admin distinct.
~~~powershell
Get-ADDefaultDomainPasswordPolicy
Get-ADUserResultantPasswordPolicy -Identity ivedere
Search-ADAccount -LockedOut
~~~

## 5–6 — Imprimante et magasin central
- GPO-Utilisateurs-Deploiement-Imprimante : Préférences → imprimante partagée (Dell 5210CN depuis SRV1), ciblage par service/groupe au niveau élément ou sécurité. Vérifier installation automatique et absence chez non-ciblé.
- Centraliser ADMX et dossiers langues ADML compatibles dans \\domED.ad\SYSVOL\domED.ad\Policies\PolicyDefinitions.
- Vérifier depuis Win-CL1 que l'éditeur utilise le magasin central.

## 7 — Droits locaux, dossiers et RDP
| Cas | Mise en œuvre proposée | Contrôle |
|---|---|---|
| Support | Ajouter G-Support technique aux opérateurs de configuration réseau locaux via GPP, sans écraser les autres membres | Ivan sur client |
| Documents | Rediriger vers \\SRV1\Users$ ; tous sauf intérimaires ; permissions individualisées | Fichier utilisateur et non-application à Christophe |
| RDP/NLA | GPO sur OU Serveurs membres : autoriser RDP, exiger NLA, ouvrir les règles pare-feu nécessaires et ajouter G-Support technique aux utilisateurs du Bureau à distance | SRV1 après gpupdate |
- Désactiver RDP sur SRV1 avant le test prévu, conserver un accès console pour récupérer la machine.
- Utiliser un partage Users$ distinct, par exemple C:\Base si prévu ; tester le cloisonnement des dossiers. Exclusion intérimaires par filtrage adapté.
- Pour RDP, vérifier aussi le droit d'ouverture de session via Services Bureau à distance et les refus éventuels.

## Livrables
- [ ] GPO nommées, liées, ciblées et testées.
- [ ] Politique domaine et PSO vérifiées, justification du ciblage.
- [ ] Imprimante déployée et magasin ADMX central.
- [ ] Délégation réseau, redirection Documents et RDP/NLA testés.
- [ ] Rapport gpresult et compte rendu des résultats réels.
