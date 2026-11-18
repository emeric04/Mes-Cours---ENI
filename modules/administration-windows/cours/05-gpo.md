# Stratégies de groupe (GPO)

_Source : Cours, diapositives 116–145 ; TP05. Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## Fonctionnement
- Une GPO centralise les paramètres ordinateur et utilisateur : sécurité, système, scripts, déploiement et applications.
- Le registre contient des ruches, clés et valeurs. HKLM concerne l'ordinateur, HKCU l'utilisateur courant ; HKCR les classes, HKU les profils chargés, HKCC le profil matériel.
- Stratégie locale : poste individuel. Stratégie de domaine : objets ciblés par liaison, avec priorité habituelle sur la locale.
- Les clients récupèrent/appliquent les stratégies à l'aide des extensions CSE ; données GPO dans AD et SYSVOL.
- Actualisation habituelle : postes/serveurs membres 90 min + délai aléatoire jusqu'à 30 min ; DC 5 min. Certains réglages exigent une nouvelle session ou un redémarrage.

## Ciblage et priorité
| Mécanisme | Rôle |
|---|---|
| Site, domaine, OU | Emplacements de liaison |
| Ordinateur / utilisateur | Les deux sections de configuration |
| Sécurité | Filtre les objets autorisés à lire/appliquer |
| WMI | Ciblage par critères système |
| Blocage d'héritage | Empêche les liaisons parentes non appliquées (non forcées) |
| Appliqué / forcé (Enforced) | Lien prioritaire qui dépasse le blocage |
Ordre habituel LSDOU : locale, site, domaine, OU parent vers enfant ; au même niveau, l'ordre de liaison 1 a la priorité. Les liens forcés peuvent modifier cette logique.
Un groupe AD sert au filtrage mais n'est pas une cible de liaison. Pour les paramètres utilisateur, conserver les droits de lecture nécessaires aux ordinateurs.

## Administration et diagnostic
~~~cmd
gpmc.msc
gpupdate /force
gpresult /r
gpresult /h resultat-gpo.html
~~~
- GPO absente du rapport : vérifier OU, liaison, filtrage, lecture, réplication et WMI.
- GPO présente mais effet absent : conflit, paramètre/OS incompatibles, session à relancer.
- Tester les comptes ciblés ET non ciblés ; générer un rapport, relever le résultat réel.

## Modèles d'administration
| Fichier | Rôle |
|---|---|
| ADMX | Définition des paramètres |
| ADML | Ressources dans chaque langue |
| C:\Windows\PolicyDefinitions | Magasin local |
| \\domED.ad\SYSVOL\domED.ad\Policies\PolicyDefinitions | Magasin central |
Copier des modèles compatibles et leurs fichiers de langue ; vérifier le magasin utilisé dans l'éditeur.

## Politiques de compte
- Stratégie de domaine (souvent Default Domain Policy, ou GPO dédiée liée au domaine) pour les comptes du domaine.
- Une GPO classique liée à une OU ne permet pas de définir une politique de mot de passe distincte pour ces seuls utilisateurs de domaine.
- PSO (Fine-Grained Password Policy) : objet hors GPO, dans System / Password Settings Container ; affectable aux utilisateurs ou groupes globaux de sécurité.

~~~powershell
Get-ADDefaultDomainPasswordPolicy
Get-ADFineGrainedPasswordPolicy -Filter *
Get-ADUserResultantPasswordPolicy -Identity ivedere
~~~
## Exemples du TP05
- Pare-feu et dernier identifiant ; restrictions Direction et intérimaires ; stratégie de compte ; imprimante ; magasin central.
- Préférences : ciblage d'éléments, groupes locaux. Redirection Documents et RDP avec NLA.
- La PSO informatique impose 2 échecs puis déverrouillage par administrateur dans l'atelier (pas une recommandation universelle de production).
