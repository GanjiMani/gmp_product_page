"""
Script to insert the test record first
This inserts a single record to verify the table structure
"""
from datetime import datetime
from database import SessionLocal
from models import Observation

def parse_date(date_str):
    """Parse date string in MM/DD/YYYY format"""
    if not date_str or date_str.strip() == '':
        return None
    try:
        return datetime.strptime(date_str.strip(), '%m/%d/%Y').date()
    except:
        return None

def insert_test_record():
    """Insert the test record provided by user"""
    db = SessionLocal()
    try:
        # Test record data
        test_record = Observation(
            InspectionID=1295926,
            FEINumber='3027581851',
            LegalName='CATAO MARKET LLC',
            InspectionEndDate=parse_date('12/19/2025'),
            ProgramArea='Foods',
            ActCFRNumber='21 CFR 117.10',
            ShortDescription='Personnel',
            LongDescription='You did not take a reasonable measure or precaution related to personnel practices.'
        )
        
        db.add(test_record)
        db.commit()
        print("SUCCESS: Test record inserted successfully!")
        print(f"  InspectionID: {test_record.InspectionID}")
        print(f"  FEINumber: {test_record.FEINumber}")
        print(f"  LegalName: {test_record.LegalName}")
        print(f"  ProgramArea: {test_record.ProgramArea}")
        
    except Exception as e:
        db.rollback()
        print(f"Error inserting test record: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    try:
        insert_test_record()
    except Exception as e:
        print(f"Failed to insert test record: {e}")
        raise
