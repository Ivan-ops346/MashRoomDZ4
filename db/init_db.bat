@echo off
set DB_NAME=mushroom
set DB_USER=postgres
set DB_HOST=localhost

psql -U %DB_USER% -h %DB_HOST% -c "CREATE DATABASE %DB_NAME;" 2>nul

psql -U %DB_USER% -h %DB_HOST% -d %DB_NAME% -f db\MushRoom_CreateTables.sql
psql -U %DB_USER% -h %DB_HOST% -d %DB_NAME% -f db\MushRoom_InsertTestData.sql

pause