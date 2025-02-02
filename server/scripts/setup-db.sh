#!/bin/bash

# Create database
createdb pickleball

# Create user if it doesn't exist
psql -c "DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
    CREATE USER postgres WITH PASSWORD 'postgres';
  END IF;
END
\$\$;"

# Grant privileges
psql -d pickleball -c "GRANT ALL PRIVILEGES ON DATABASE pickleball TO postgres;"
psql -d pickleball -c "ALTER USER postgres WITH SUPERUSER;" 