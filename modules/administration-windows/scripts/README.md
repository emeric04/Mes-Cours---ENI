# Scripts PowerShell

Exemples pédagogiques Windows PowerShell 5.1. Non exécutés sur les VM. Vérifier OU, domaine et droits avant usage. Les scripts AD nécessitent le module ActiveDirectory. Les exports sont enregistrés dans livrables/ du répertoire courant.

- activation-compte.ps1 : réinitialisation et activation après confirmation ; saisie sécurisée.
- creation-utilisateur.ps1 : création interactive désactivée, ne copie pas les modèles.
- export-groupes.ps1 : membres directs des groupes globaux de l'OU.
- export-utilisateur.ps1 : export des propriétés (David par défaut).
- controle-stockage.ps1 : vérifications en lecture seule sur SRV1.
