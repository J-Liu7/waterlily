# Windows Database Setup Guide

Since PostgreSQL command-line tools may not be in your PATH, here are several ways to set up the database:

## Option 1: Using pgAdmin (Recommended)

1. **Open pgAdmin 4** (if installed with PostgreSQL)
2. **Connect to your PostgreSQL server** using your postgres user password
3. **Create a new database**:
   - Right-click "Databases" → "Create" → "Database"
   - Name: `survey_app`
   - Click "Save"
4. **Run the schema**:
   - Right-click on `survey_app` database → "Query Tool"
   - Copy and paste the contents of `database/schema.sql`
   - Click "Execute" (F5)
5. **Add sample data** (optional):
   - Copy and paste the contents of `database/sample_data.sql`
   - Click "Execute" (F5)

## Option 2: Using Command Line with Full Path

```powershell
# Navigate to your PostgreSQL installation
cd "C:\Program Files\PostgreSQL\17\bin"

# Create database (will prompt for password)
.\createdb.exe -U postgres survey_app

# Run schema (will prompt for password)
.\psql.exe -U postgres -d survey_app -f "C:\survey-app\database\schema.sql"

# Add sample data (will prompt for password)
.\psql.exe -U postgres -d survey_app -f "C:\survey-app\database\sample_data.sql"
```

## Option 3: Using psql Interactive Mode

```powershell
# Start psql (will prompt for password)
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres

# Then run these SQL commands:
CREATE DATABASE survey_app;
\c survey_app
\i 'C:/survey-app/database/schema.sql'
\i 'C:/survey-app/database/sample_data.sql'
\q
```

## Option 4: Add PostgreSQL to PATH (One-time setup)

1. **Add to System PATH**:
   - Press `Win + X` → "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System Variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\PostgreSQL\17\bin`
   - Click "OK" to save

2. **Restart PowerShell** and then use:
```powershell
createdb -U postgres survey_app
psql -U postgres -d survey_app -f database/schema.sql
psql -U postgres -d survey_app -f database/sample_data.sql
```

## Verify Database Setup

After setting up the database, verify it worked:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d survey_app -c "\dt"
```

You should see tables: `users`, `surveys`, `questions`, `survey_responses`, `question_responses`

## Default Test Account

The sample data includes a test user:
- **Email**: john.doe@example.com
- **Password**: password123

## Troubleshooting

### Password Issues
If you forgot your postgres password:
1. Look for it in PostgreSQL installation notes
2. Or reset it using Windows Services → PostgreSQL service properties

### Connection Issues
- Ensure PostgreSQL service is running (Windows Services)
- Default port is 5432
- Default host is localhost

### Permission Issues
- Run PowerShell as Administrator if needed
- Ensure postgres user has database creation privileges