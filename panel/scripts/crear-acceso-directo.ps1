$root = Split-Path -Parent $PSScriptRoot
$vbs  = Join-Path $root 'scripts\iniciar.vbs'
$ico  = Join-Path $root 'public\icons\favicon.ico'
$ws   = New-Object -ComObject WScript.Shell

$destinos = @(
  (Join-Path ([Environment]::GetFolderPath('Desktop')) 'EcoRuta.lnk'),
  (Join-Path ([Environment]::GetFolderPath('Programs')) 'EcoRuta.lnk')
)
foreach ($d in $destinos) {
  $s = $ws.CreateShortcut($d)
  $s.TargetPath       = Join-Path $env:WINDIR 'System32\wscript.exe'
  $s.Arguments        = '"' + $vbs + '"'
  $s.WorkingDirectory = $root
  $s.IconLocation     = $ico
  $s.Description      = 'EcoRuta Admin - Panel de Control'
  $s.Save()
}
