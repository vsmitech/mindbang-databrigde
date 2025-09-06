#!/bin/bash

# Define el entorno por defecto si no se proporciona
ENV=${1:-dev}

# Determina el archivo .env a usar
ENV_FILE=".env.$ENV"

# Verifica si el archivo .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: El archivo de entorno '$ENV_FILE' no existe."
    exit 1
fi

# Carga las variables de entorno desde el archivo
echo "--> Cargando entorno desde $ENV_FILE"
set -a
source "$ENV_FILE"
set +a

# Inicia la arquitectura de bases de datos
echo "Iniciando la arquitectura de bases de datos para el entorno '$ENV'..."

# Inicia la base de datos auth
echo "--> Iniciando MongoDB para el servicio auth..."
cd auth-db
docker-compose up -d --build
cd ..

# Inicia la base de datos de usuarios
echo "--> Iniciando MongoDB para el servicio users..."
cd users-db
docker-compose up -d --build
cd ..

echo "Todos los servicios de bases de datos están en funcionamiento."