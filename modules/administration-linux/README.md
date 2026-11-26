# Administration d’un système Linux — ENI ASR

Module de révision **Oracle Linux 8 / famille RHEL**, fondé sur le support ENI 2021-11 (85 pages).

- [Portail Linux](index.html)
- [Choisir un QCM par chapitre](qcm/index.html) : **20 questions** par tentative, **11 chapitres** indépendants.
- [QCM global](qcm/index.html?mode=global) : **40 questions** équilibrées sur les 11 chapitres.
- Banque de **282 questions** : 25 questions au minimum dans chaque chapitre, 32 en stockage.
- [Réseau](qcm/index.html?chapitre=6) · [Paquets](qcm/index.html?chapitre=7) · [Stockage et LVM](qcm/index.html?chapitre=8) · [Permissions](qcm/index.html?chapitre=10)

## Fonctionnement pédagogique du QCM

À chaque nouveau tirage, l’outil sélectionne des questions d'après **les sous-thèmes du chapitre** (définis par les pages du support). Il donne la priorité aux questions **les moins utilisées**, puis à celles absentes de la tentative précédente. Les questions et leurs quatre propositions sont mélangées.

Après chaque réponse : correction, explication et page de référence du PDF ENI. En fin de session : score, bilan par chapitre et revue des erreurs. La progression se mémorise localement **séparément pour chaque mode** ; les données ne quittent pas le navigateur.

## Organisation

- `cours/` : 11 synthèses HTML + Markdown.
- `fiches/` : commandes et dépannage.
- `qcm/index.html` : sélection de chapitre et écrans des QCM.
- `qcm/quiz.js` : tirage stratifié, rotation, sessions et corrections.
- `qcm/quiz.css` : présentation responsive claire / sombre.
- `qcm/questions.js` : 184 questions de départ.
- `qcm/questions-complement-{1,2,3}.js` : 98 nouvelles questions, soit **282 au total**.

### Ajouter une question

Dans l’un des fichiers `questions-complement-*.js`, ajouter un objet avec :
`id` (unique), `ch` (de 1 à 11), `page` (numéro du support),
`q` (énoncé), `choices` (quatre propositions), `answer` (index de 0 à 3)
et `why` (explication de la bonne réponse).

La banque est vérifiée à l’exécution : ID unique, quatre choix distincts, réponse valide et au moins 20 questions par chapitre.

**Source :** ENI École Informatique, *Administration d’un système Linux*, support 2021-11, 85 pages. Reformulations de révision non officielles. Aucun PDF original, capture privée ou secret n'est publié.
