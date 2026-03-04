@echo off
echo Connecting to server and setting up PostgreSQL...
echo.
echo Password: y,ryCBirzktZ-3
echo.

ssh root@5.42.106.229 "psql -U postgres -c \"
DO
\$do\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'adminmfo') THEN
      CREATE USER adminmfo WITH PASSWORD '546815hH!';
   END IF;
END
\$do\$;
\""

ssh root@5.42.106.229 "psql -U postgres -c \"CREATE DATABASE my_mfo;\""
ssh root@5.42.106.229 "psql -U postgres -c \"ALTER DATABASE my_mfo OWNER TO adminmfo;\""

ssh root@5.42.106.229 "psql -U postgres -d my_mfo -c \"
CREATE TABLE IF NOT EXISTS mfo_companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    sum_min INTEGER DEFAULT 0,
    sum_max INTEGER DEFAULT 0,
    term_min INTEGER DEFAULT 0,
    term_max INTEGER DEFAULT 0,
    percent DECIMAL(5,2) DEFAULT 0,
    first_free BOOLEAN DEFAULT false,
    instant BOOLEAN DEFAULT false,
    badge VARCHAR(255),
    site_url VARCHAR(500),
    address TEXT,
    phone VARCHAR(50),
    inn VARCHAR(20),
    ogrn VARCHAR(20),
    license VARCHAR(255),
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO adminmfo;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO adminmfo;
\""

echo.
echo Done! Please check the results.
pause
