#! bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo ".env file not found!"
  exit 1
fi

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

artillery run ./artillery/user-flow-test.yml --record --key $ARTILLERY_CLOUD_API_KEY
