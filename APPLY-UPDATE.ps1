# Run this script from the extracted bodolvo-web folder.
$source = $PSScriptRoot
$target = 'C:\Users\Grimmy\bodolvo-web-deploy'
if (-not (Test-Path (Join-Path $target '.git'))) { throw "Git repository not found at $target. Nothing was copied." }
$items = @('app','lib','public','package.json','package-lock.json','next.config.ts','tsconfig.json','postcss.config.mjs','eslint.config.mjs','next-env.d.ts')
foreach ($item in $items) {
  $from = Join-Path $source $item
  if (Test-Path $from) { Copy-Item -Path $from -Destination $target -Recurse -Force }
}
Write-Host "Updated source files in $target. Git history and local environment files were untouched."
Write-Host 'Stop any old npm dev server, then run: cd C:\Users\Grimmy\bodolvo-web-deploy; npm run build; npm run dev'
