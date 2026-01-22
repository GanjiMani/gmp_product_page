"""
Script to create the Observations table in SQL Server
Run this first before importing data
"""
from database import engine, Base
from models import Observation

def create_tables():
    """Create all tables defined in models"""
    print("Creating Observations table...")
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: Table 'Observations' created successfully!")

if __name__ == "__main__":
    try:
        create_tables()
    except Exception as e:
        print(f"Error creating table: {e}")
        raise
