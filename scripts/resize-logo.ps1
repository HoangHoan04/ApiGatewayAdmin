Add-Type -AssemblyName System.Drawing
$source = Join-Path $PSScriptRoot '..\public\SMARTHRM.png'
$outDir = Join-Path $PSScriptRoot '..\src\assets\icons'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$img = [System.Drawing.Image]::FromFile((Resolve-Path $source))
Write-Output "Source size: $($img.Width)x$($img.Height)"

foreach ($size in @(32, 64)) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $size, $size)
  $outPath = Join-Path $outDir "smarthrm-$size.png"
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Output "Wrote $outPath"
}

$img.Dispose()
