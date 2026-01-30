#!/bin/bash

CONTAINER_NAME="powermas-sqlserver"
SA_PASSWORD="PowerMas2026!"
DB_NAME="PowerMasDB"

echo "Esperando a que SQL Server este listo..."
sleep 5

for i in {1..30}; do
    docker exec $CONTAINER_NAME /opt/mssql-tools18/bin/sqlcmd \
        -S localhost -U sa -P "$SA_PASSWORD" -C -Q "SELECT 1" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        break
    fi
    sleep 2
done

echo "Creando schema..."
docker exec -i $CONTAINER_NAME /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P "$SA_PASSWORD" -C \
    -i /dev/stdin < database/schema.sql

echo "Creando stored procedures..."
docker exec -i $CONTAINER_NAME /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P "$SA_PASSWORD" -C -d $DB_NAME \
    -i /dev/stdin < database/procedures.sql

echo "Cargando datos iniciales..."
docker exec -i $CONTAINER_NAME /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P "$SA_PASSWORD" -C -d $DB_NAME \
    -i /dev/stdin < database/seed.sql

echo "Base de datos configurada correctamente"
