#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo ".env file not found!"
  exit 1
fi

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# build the PostgreSQL Docker image
docker build -t ecommerce-postgres ./postgresql

# Run PostgreSQL container
docker run --name ecommerce-postgres \
  -e POSTGRES_USER=${POSTGRES_USER} \
  -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
  -e POSTGRES_DB=${POSTGRES_DB} \
  -v ./postgresql/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -p 5432:5432 \
  ecommerce-postgres