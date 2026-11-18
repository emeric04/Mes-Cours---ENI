# TP 03 — Gestion d’un domaine AD

_Source : TP03 — énoncé, p. 1–7. Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## OU et comptes modèles
~~~text
domED.ad
└── Société ASR
    ├── Utilisateurs
    │   ├── Direction
    │   ├── Informatique
    │   └── Comptabilité
    ├── Groupes
    │   ├── Direction
    │   ├── Informatique
    │   └── Comptabilité
    ├── Postes de travail / Clients
    └── Serveurs
        ├── Contrôleurs de domaine
        └── Serveurs membres
~~~
| Modèle | Attributs demandés |
|---|---|
| Direction | Nantes, 44000, Direction, Société ASR |
| Informatique | Service Informatique |
| Comptabilité | Service Comptabilité, horaires lundi–samedi 07 h–21 h |
ADUC → clic droit sur le modèle → Copier. Contrôler les attributs et l'OU. Attention en pratique : les DC sont normalement conservés dans l'OU Domain Controllers ; le déplacement demandé doit être encadré et les GPO DC contrôlées.

## Utilisateurs
| Nom | Login | Service / fonction | Tél. |
|---|---|---|---|
| David Grenier | dgrenier | Direction / Directeur Comptabilité Finances | 504 |
| Isabelle Védère | ivedere | Informatique / Administratrice systèmes et réseaux | 666 |
| Ivan Tard | itard | Informatique / Support technique | — |
| Christelle Urique | curique | Comptabilité / Comptable | — |
| Christophe Talmie | ctalmie | Comptabilité / Comptable intérimaire | — |
- Tous sont désactivés et sans mot de passe lors de la création.
- Activer David, Isabelle et Christelle après saisie sécurisée du secret prévu par l'énoncé ; ne pas le versionner.
- Christophe : date d'expiration au 31 décembre de l'année en cours. L'expiration ne change pas la propriété Enabled.
- Tester une ouverture de session de domaine.

## Groupes de sécurité globaux
| Groupe | Membres directs |
|---|---|
| G-Direction | Modèle Direction, David ; mail direction@domED.fr |
| G-Informatique | Modèle Informatique, G-Support technique, Isabelle |
| G-Support technique | Ivan |
| G-Comptabilité | Christelle, Christophe |
| G-Intérimaires | Christophe |
~~~powershell
# Adapter l'OU si necessaire (exemple conforme au schema du TP)
New-ADGroup -Name "G-Intérimaires" -GroupScope Global -GroupCategory Security -Path "OU=Comptabilité,OU=Groupes,OU=Société ASR,DC=domED,DC=ad"
Add-ADGroupMember -Identity "G-Intérimaires" -Members ctalmie
Get-ADGroupMember -Identity "G-Intérimaires"
~~~

## Requête enregistrée : Comptes désactivés
ADUC → Requêtes enregistrées → Nouveau → Requête ; nom Comptes désactivés ; racine domaine, sous-conteneurs ; Définir la requête → Recherches communes → Utilisateurs → Comptes désactivés. Ivan et Christophe attendus, ainsi que les autres comptes désactivés.

## Sites
- Renommer site par défaut Siege ; créer Agence ; associer 172.16.0.0/16 à Agence (sans DC).
- Vérifier DNS et sous-réseaux ; exécuter nltest depuis Win-CL1.
~~~cmd
nltest /dsgetsite
~~~

## Bonus
- Exporter les groupes globaux créés et leurs membres directs dans livrables/ctrl_membres_groupes.txt.
- Exporter les propriétés de David dans livrables/detail_user_David.txt.
- Scripts réutilisables disponibles dans la rubrique Scripts ; les exports ne sont pas des preuves tant qu'ils n'ont pas été générés sur le lab.

## Livrables
- [ ] Modèles, 5 comptes, activations et expiration vérifiés.
- [ ] Groupes et OU ; groupe intérimaires créé en commande.
- [ ] Requête et sites ; vérification depuis Win-CL1.
- [ ] Exports bonus, si réalisés.
