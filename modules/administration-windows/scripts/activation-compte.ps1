# Lab ENI - saisie interactive, aucune valeur secrete en dur.
Import-Module ActiveDirectory -ErrorAction Stop
do {
    Write-Host "=== Activation du compte AD ===" -ForegroundColor Cyan
    $User = Read-Host "Identifiant"
    try {
        $Compte = Get-ADUser -Identity $User -ErrorAction Stop
        Write-Host ("Compte : " + $Compte.Name)
        if ((Read-Host "Confirmer la reinitialisation et activation (O/N)") -eq "O") {
            $Pass = Read-Host "Nouveau mot de passe" -AsSecureString
            Set-ADAccountPassword -Identity $Compte -Reset -NewPassword $Pass -ErrorAction Stop
            Enable-ADAccount -Identity $Compte -ErrorAction Stop
            Get-ADUser -Identity $Compte.DistinguishedName -ErrorAction Stop |
                Select-Object Name,SamAccountName,Enabled
        }
    }
    catch {
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    $Continuer = Read-Host "Autre utilisateur (O/N)"
} while ($Continuer -eq "O")
