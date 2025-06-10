#!/bin/sh

echo "Waiting for MySQL to be ready..."
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 5
done

echo "Running migrations..."
npx sequelize-cli db:migrate

echo "Starting server..."
npm run start
