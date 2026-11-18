# Lecture seule - a executer sur SRV1
Write-Host "=== Pools ===" -ForegroundColor Cyan
Get-StoragePool -IsPrimordial $false | Format-Table FriendlyName,HealthStatus,OperationalStatus,Size
Write-Host "=== Disques physiques ===" -ForegroundColor Cyan
Get-PhysicalDisk | Format-Table FriendlyName,Size,HealthStatus,OperationalStatus
Write-Host "=== Disques virtuels ===" -ForegroundColor Cyan
Get-VirtualDisk | Format-List FriendlyName,ResiliencySettingName,HealthStatus,OperationalStatus,NumberOfDataCopies,PhysicalDiskRedundancy
Write-Host "=== Volumes et points de montage ===" -ForegroundColor Cyan
Get-Volume | Format-Table DriveLetter,FileSystemLabel,FileSystem,HealthStatus,Size
Get-Partition | Format-List DiskNumber,DriveLetter,AccessPaths
