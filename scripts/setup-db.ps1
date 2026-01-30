$ContainerName = "powermas-sqlserver"
$SaPassword = "PowerMas2026!"
$DbName = "PowerMasDB"

Write-Host "Esperando a que SQL Server este listo..."
Start-Sleep -Seconds 5

for ($i = 1; $i -le 30; $i++) {
    $result = docker exec $ContainerName /opt/mssql-tools18/bin/sqlcmd `
        -S localhost -U sa -P $SaPassword -C -Q "SELECT 1" 2>$null
    if ($LASTEXITCODE -eq 0) { break }
    Start-Sleep -Seconds 2
}

Write-Host "Creando schema..."
Get-Content database/schema.sql | docker exec -i $ContainerName /opt/mssql-tools18/bin/sqlcmd `
    -S localhost -U sa -P $SaPassword -C

Write-Host "Creando stored procedures..."
Get-Content database/procedures.sql | docker exec -i $ContainerName /opt/mssql-tools18/bin/sqlcmd `
    -S localhost -U sa -P $SaPassword -C -d $DbName

Write-Host "Cargando datos iniciales..."
Get-Content database/seed.sql | docker exec -i $ContainerName /opt/mssql-tools18/bin/sqlcmd `
    -S localhost -U sa -P $SaPassword -C -d $DbName

Write-Host "Base de datos configurada correctamente"
