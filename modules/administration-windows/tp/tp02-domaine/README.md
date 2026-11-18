# TP 02 — Création du domaine AD

_Source : TP02 — énoncé, p. 1–4. Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## Pré-requis
TP01 fonctionnel ; CD1 192.168.21.1, SRV1 .10, Win-CL1 .20, masque /16.

## CD1 : première forêt
- Configurer IP statique et nom ; installer AD DS avec outils de gestion.
- Simuler/prévalider la promotion, puis promouvoir CD1 dans domED.ad (NN remplacé par ED).
~~~powershell
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
Test-ADDSForestInstallation -DomainName "domED.ad"
Install-ADDSForest -DomainName "domED.ad"
~~~
Saisir le mot de passe DSRM à l'invite ; sauvegarder le lab avant promotion.

## CD2 et intégrations
- Nouvelle VM CD2 : Windows Server 2022, 1 CPU, 4 Go RAM, 40 Go, host-only, 192.168.21.2/16.
- Configurer DNS vers CD1, joindre CD2 au domaine, installer AD DS puis promouvoir comme DC supplémentaire.
- Joindre SRV1 et Win-CL1 : DNS interne à l'AD ; tester authentification.
- Installer les RSAT sur Win-CL1 ; ouvrir Centre d'administration AD et créer un compte à son identité.
~~~powershell
# Sur CD2 apres jonction
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
Install-ADDSDomainController -DomainName "domED.ad"
# Sur un poste membre, verifier le canal
Test-ComputerSecureChannel
~~~

## Rôles FSMO
Transférer RID Master et PDC Emulator à CD2 ; les autres restent sur CD1 dans ce scénario.
~~~powershell
Move-ADDirectoryServerOperationMasterRole -Identity CD2 -OperationMasterRole RIDMaster,PDCEmulator
netdom query fsmo
repadmin /replsummary
~~~
## Livrables
- [ ] CD1 et CD2 promus ; réplication fonctionnelle.
- [ ] SRV1 et Win-CL1 joints ; authentification testée.
- [ ] RSAT + utilisateur créé depuis le client.
- [ ] Preuve netdom query fsmo (RID et PDC sur CD2).
