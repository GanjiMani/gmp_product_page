# Setup Instructions

## Prerequisites

1. **Python 3.8+** installed
2. **ODBC Driver 17 for SQL Server** installed
   - Download from: https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server
3. **Database access** to your SQL Server instance

## Step-by-Step Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Verify .env File

Make sure `.env` file exists in the `backend` folder with your credentials:
```
DB_SERVER=ss-ai-dev-ci-001.database.windows.net
DB_NAME=db-ai-dev-ci-001
DB_USER=dbo.admin
DB_PASSWORD=AIdevsql!@#456
```

### 3. Create the Database Table

Run this first to create the `Observations` table:

```bash
python create_table.py
```

Expected output:
```
Creating Observations table...
✓ Table 'Observations' created successfully!
```

### 4. Insert Test Record (Optional)

Insert the single test record to verify everything works:

```bash
python insert_test_record.py
```

Expected output:
```
✓ Test record inserted successfully!
  InspectionID: 1295926
  FEINumber: 3027581851
  LegalName: CATAO MARKET LLC
  ProgramArea: Foods
```

### 5. Import Full Excel Data

Import all 269,054 records from the Excel file in batches:

```bash
python import_excel_batch.py
```

This will:
- Read the Excel file: `C:\Users\manig\Downloads\product&service_gmp\gmp_dashboard\2,69,054_data.xlsx`
- Process data in batches of 1000 records
- Skip duplicate records (based on InspectionID)
- Show progress updates
- Display summary at the end

Expected output:
```
Reading Excel file: ...
✓ Excel file loaded. Total rows: 269054
Columns: ['Inspection ID', 'FEI Number', ...]

Processing batch 1/270 (rows 1-1000)...
  ✓ Inserted 1000 records
  Progress: 0.4% | Total inserted: 1000 | Skipped: 0 | Errors: 0

...

============================================================
Import completed!
  Total records processed: 269054
  Successfully inserted: 269054
  Skipped (duplicates/missing): 0
  Errors: 0
============================================================
```

## Troubleshooting

### Error: "ODBC Driver 17 for SQL Server" not found
- Install the driver from Microsoft's website
- Or update the connection string in `database.py` to use a different driver version

### Error: "Database environment variables are not fully set"
- Check that `.env` file exists in the `backend` folder
- Verify all variables are set correctly

### Error: Connection timeout
- Check your network connection
- Verify database server is accessible
- Check firewall settings

### Error: "Table already exists"
- The table was already created
- You can continue to step 4 or 5

### Error: "Duplicate key" during import
- This is normal - the script skips duplicates automatically
- Check the "Skipped" count in the summary

## Next Steps

After successful import:
1. Verify data in SQL Server Management Studio (SSMS)
2. Create indexes for better query performance (optional)
3. Set up FastAPI backend to serve data to frontend
4. Update React frontend to fetch data from API

## File Structure

```
backend/
├── database.py              # Database connection
├── models.py                 # SQLAlchemy models
├── create_table.py          # Create table script
├── insert_test_record.py    # Insert test record
├── import_excel_batch.py    # Import Excel data
├── .env                     # Environment variables
├── requirements.txt         # Python dependencies
└── README.md                # Documentation
```
