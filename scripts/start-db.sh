#!/bin/bash

# Configuration
PORT=5432
APP_NAME="Postgres"
PG_ISREADY="/Applications/Postgres.app/Contents/Versions/latest/bin/pg_isready"

echo "🔍 Checking if PostgreSQL is running on port $PORT..."

# Check if the database is already reachable
if $PG_ISREADY -p $PORT -q; then
    echo "✅ PostgreSQL is already running."
    exit 0
fi

echo "🚀 Starting $APP_NAME.app..."
open -a "$APP_NAME"

# Wait for the database to become ready
MAX_RETRIES=30
RETRY_COUNT=0

echo "⏳ Waiting for PostgreSQL to become ready..."
while ! $PG_ISREADY -p $PORT -q; do
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Timeout: PostgreSQL failed to start after $MAX_RETRIES seconds."
        exit 1
    fi
    sleep 1
done

echo "✅ PostgreSQL is ready!"
exit 0
