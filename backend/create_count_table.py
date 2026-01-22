"""
Script to create the CountTable in SQL Server
"""
from database import engine, Base
from models import CountTable

def create_count_table():
    """Create the CountTable"""
    print("Creating CountTable...")
    CountTable.__table__.create(bind=engine, checkfirst=True)
    print("SUCCESS: Table 'CountTable' created successfully!")

if __name__ == "__main__":
    try:
        create_count_table()
    except Exception as e:
        print(f"Error creating table: {e}")
        raise
