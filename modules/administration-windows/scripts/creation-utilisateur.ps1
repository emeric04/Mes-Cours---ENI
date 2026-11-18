# Exemple generique : ne remplace pas la copie des modeles du TP03.
Import-Module ActiveDirectory -ErrorAction Stop
$BaseOU = "OU=Utilisateurs,OU=Société ASR,DC=domED,DC=ad"
do {
    Write-Host "=== Creation utilisateur AD ===" -ForegroundColor Cyan
    $Prenom = (Read-Host "Prenom").Trim()
    $Nom = (Read-Host "Nom").Trim()
    if (-not $Prenom -or -not $Nom) {
        Write-Host "Prenom et nom obligatoires" -ForegroundColor Red
    }
    else {
        $Login = ($Prenom.Substring(0,1) + $Nom).ToLowerInvariant().Normalize("FormD") -replace '\p{Mn}|[^a-zA-Z0-9._-]', ''
        $Services = @("Direction","Informatique","Comptabilité")
        do {
            Write-Host "1 Direction / 2 Informatique / 3 Comptabilite"
            $Choix = Read-Host "Service"
        } until ($Choix -in "1","2","3")
        $Service = $Services[[int]$Choix - 1]
        $Params = @{
            Name = "$Prenom $Nom"
            GivenName = $Prenom
            Surname = $Nom
            DisplayName = "$Prenom $Nom"
            SamAccountName = $Login
            UserPrincipalName = "$Login@domED.ad"
            Department = $Service
            Path = "OU=$Service,$BaseOU"
            Enabled = $false
        }
        $Fonction = Read-Host "Fonction (facultatif)"
        $Telephone = Read-Host "Telephone (facultatif)"
        if ($Fonction) { $Params.Title = $Fonction }
        if ($Telephone) { $Params.OfficePhone = $Telephone }
        if ((Read-Host "Expiration au 31 decembre (O/N)") -eq "O") {
            # Expiration en debut de journee du 1er janvier suivant.
            $Params.AccountExpirationDate = (Get-Date -Year ((Get-Date).Year + 1) -Month 1 -Day 1).Date
        }
        Write-Host "$Login / $Service / compte desactive sans mot de passe"
        if ((Read-Host "Confirmer (O/N)") -eq "O") {
            try {
                if (-not $Login -or $Login.Length -gt 20) { throw "Identifiant vide ou trop long (max 20)." }
                New-ADUser @Params -ErrorAction Stop
                Write-Host "Compte cree" -ForegroundColor Green
            }
            catch { Write-Host $_.Exception.Message -ForegroundColor Red }
        }
    }
    $Continuer = Read-Host "Autre utilisateur (O/N)"
} while ($Continuer -eq "O")
