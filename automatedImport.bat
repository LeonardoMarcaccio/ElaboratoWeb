@echo off
REM Path to the MySQL executable
set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"

REM Database credentials
set DB_USER=root
set DB_PASSWORD=password

REM Database name
set DB_NAME=playpal

REM Path to the SQL file
set SQL_FILE="C:\xampp\htdocs\DB\PlayPal_DatabaseGenerator.sql"

REM Command to create the database if it does not exist
%MYSQL_PATH% -u%DB_USER% -p%DB_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;"

REM Command to import the SQL file
%MYSQL_PATH% -u%DB_USER% -p%DB_PASSWORD% %DB_NAME% < %SQL_FILE%

echo Database importato con successo!
pause
