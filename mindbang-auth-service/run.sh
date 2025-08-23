#!/bin/bash

ENV=$1

case "$ENV" in
  dev) NODE_ENV="development" ;;
  prod) NODE_ENV="production" ;;
  test) NODE_ENV="test" ;;
  *) echo "❌ Entorno inválido: $ENV"; exit 1 ;;
esac

echo "🚀 Ejecutando en entorno: $NODE_ENV"
NODE_ENV=$NODE_ENV npm run $ENV
