# Lecture seule AD ; execute depuis le repertoire d'atelier
Import-Module ActiveDirectory -ErrorAction Stop
$User = Read-Host "Identifiant (laisser vide pour dgrenier)"
if ([string]::IsNullOrWhiteSpace($User)) { $User = "dgrenier" }
$Dossier = Join-Path (Get-Location) "livrables"
$NomFichier = if ($User -eq "dgrenier") { "detail_user_David.txt" } else { "detail_user_$($User -replace '[^a-zA-Z0-9_.-]','_').txt" }
$Fichier = Join-Path $Dossier $NomFichier
try {
    New-Item -Path $Dossier -ItemType Directory -Force -ErrorAction Stop | Out-Null
    Get-ADUser -Identity $User -Properties * -ErrorAction Stop |
        Format-List * | Out-File -FilePath $Fichier -Encoding UTF8 -Width 4096 -ErrorAction Stop
    Write-Host "Export : $Fichier" -ForegroundColor Green
}
catch { Write-Host $_.Exception.Message -ForegroundColor Red }
