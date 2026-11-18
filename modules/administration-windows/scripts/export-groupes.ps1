# Lecture seule AD ; execute depuis le repertoire d'atelier
Import-Module ActiveDirectory -ErrorAction Stop
$OU = "OU=Groupes,OU=Société ASR,DC=domED,DC=ad"
$Dossier = Join-Path (Get-Location) "livrables"
$Fichier = Join-Path $Dossier "ctrl_membres_groupes.txt"
try {
    New-Item -Path $Dossier -ItemType Directory -Force -ErrorAction Stop | Out-Null
    $Groupes = Get-ADGroup -Filter {GroupScope -eq "Global"} -SearchBase $OU -ErrorAction Stop | Sort-Object Name
    $Rapport = foreach ($Groupe in $Groupes) {
        "===================================="
        "Groupe : $($Groupe.Name)"
        "===================================="
        $Membres = @(Get-ADGroupMember -Identity $Groupe -ErrorAction Stop)
        if ($Membres.Count -eq 0) { "(Aucun membre)" }
        else { $Membres | Sort-Object Name | Select-Object -ExpandProperty Name }
        ""
    }
    if (-not $Groupes) { throw "Aucun groupe global trouve dans l'OU." }
    $Rapport | Out-File -FilePath $Fichier -Encoding UTF8 -ErrorAction Stop
    Write-Host "Export : $Fichier" -ForegroundColor Green
}
catch { Write-Host $_.Exception.Message -ForegroundColor Red }
