-- Инициализация PostgreSQL: расширения PostGIS и pgvector
-- Этот скрипт выполняется автоматически при первом запуске контейнера

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
