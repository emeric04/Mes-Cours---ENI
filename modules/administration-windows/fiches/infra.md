# Infrastructure du lab

_Source : TP01–05 ; adaptations du lab indiquées. Synthèse personnelle ; commandes et pistes de mise en œuvre complémentaires, à vérifier._

## Topologie de référence
~~~text
        domED.ad / VMware host-only
       192.168.0.0/16 (site Siege)
       ├─ CD1       192.168.21.1  AD DS / DNS
       ├─ CD2       192.168.21.2  AD DS / DNS
       ├─ SRV1      192.168.21.10 WAC / fichiers / impression
       ├─ Win-CL1   192.168.21.20 Windows 11 / RSAT
       └─ Dell      192.168.21.30 Périphérique d'impression (prévu)

       Site Agence : 172.16.0.0/16
       Aucun DC prévu à ce stade
~~~
| Élément | Attendu |
|---|---|
| FSMO CD1 | Schéma, noms de domaine, infrastructure |
| FSMO CD2 | RID, émulateur PDC |
| SRV1 | DATA E:\, USERS C:\Base, WAC et SMB |
| Partages | Documentation, Compta, Info$, Users$ (TP05 si nécessaire) |
| DNS | Serveurs AD internes |
- Adresses ci-dessus : valeurs attendues, pas un audit des machines.
- Le schéma TP01 présente WAC :6516, mais le texte et TP02 indiquent :443. Conserver la valeur constatée.
- Les sites ne sont pas synonymes d'OU et ne routent pas les paquets. Tester depuis le client sur le réseau voulu et vérifier la connectivité DNS/DC.
- Ne pas publier les secrets, exports AD complets, captures internes non anonymisées ou clés de licence.

## Vérifications
~~~powershell
Get-ADDomainController -Filter *
Get-ADReplicationSubnet -Filter *
netdom query fsmo
repadmin /replsummary
~~~
## Journal de lab
À compléter dans les comptes rendus : versions, IP réellement utilisées, date, VM, changements et preuves.
