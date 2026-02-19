$OutputFile = "project_dump.txt"

# Limpia el archivo de salida
"PROJECT DUMP - $(Get-Date)" | Out-File $OutputFile -Encoding UTF8
"==========================================" | Out-File $OutputFile -Append -Encoding UTF8
"" | Out-File $OutputFile -Append -Encoding UTF8

# Extensiones útiles
$Extensions = @("html", "css", "js", "json", "md", "conf", "sh", "txt")

# Carpetas a excluir
$ExcludeDirs = @("\.git\", "\node_modules\", "\images\")

Get-ChildItem -Recurse -File | Where-Object {
    $ext = $_.Extension.TrimStart(".")
    $Extensions -contains $ext -and
    -not ($ExcludeDirs | Where-Object { $_ -and $_ -in $_.FullName })
} | ForEach-Object {

    "==========================================" | Out-File $OutputFile -Append -Encoding UTF8
    "FILE: $($_.FullName)" | Out-File $OutputFile -Append -Encoding UTF8
    "==========================================" | Out-File $OutputFile -Append -Encoding UTF8
    "" | Out-File $OutputFile -Append -Encoding UTF8

    Get-Content $_.FullName | Out-File $OutputFile -Append -Encoding UTF8
    "" | Out-File $OutputFile -Append -Encoding UTF8
    "" | Out-File $OutputFile -Append -Encoding UTF8
}

Write-Host "✅ Proyecto exportado a $OutputFile"
