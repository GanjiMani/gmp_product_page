# GMP Dashboard Backend

Backend for importing and managing FDA 483 Observations data.

## Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment:**
   - The `.env` file is already configured with your database credentials
   - Make sure you have ODBC Driver 17 for SQL Server installed

3. **Create the table:**
```bash
python create_table.py
```

4. **Insert test record (optional):**
```bash
python insert_test_record.py
```

5. **Import Excel data:**
```bash
python import_excel_batch.py
```

## File Structure

- `database.py` - Database connection and session management
- `models.py` - SQLAlchemy models
- `create_table.py` - Script to create database tables
- `insert_test_record.py` - Script to insert a single test record
- `import_excel_batch.py` - Script to import Excel data in batches
- `.env` - Environment variables (database credentials)
- `requirements.txt` - Python dependencies

## Notes

- The import script processes data in batches of 1000 records to prevent memory issues
- Duplicate records (based on InspectionID) are automatically skipped
- Progress is displayed during import
- The script handles date parsing and data cleaning automatically
