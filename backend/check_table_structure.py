"""Check the actual structure of AIandCountrywise table"""
from database import SessionLocal, engine
from sqlalchemy import text

db = SessionLocal()
try:
    # Get table structure
    result = db.execute(text("""
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'AIandCountrywise'
        ORDER BY ORDINAL_POSITION
    """))
    
    print("Columns in AIandCountrywise table:")
    for row in result:
        print(f"  {row[0]}: {row[1]} (nullable: {row[2]})")
    
    # Get sample data
    result = db.execute(text("SELECT TOP 10 * FROM AIandCountrywise"))
    print("\nSample data:")
    columns = [desc[0] for desc in result.cursor.description]
    print(f"Columns: {columns}")
    for row in result:
        print(row)
        
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
