"""
Script to import Excel data in batches
This prevents memory issues and allows progress tracking
"""
import pandas as pd
from datetime import datetime
from database import SessionLocal
from models import Observation
import os

# Excel file path
EXCEL_FILE = r"C:\Users\manig\Downloads\product&service_gmp\gmp_dashboard\2,69,054_data.xlsx"
BATCH_SIZE = 1000  # Insert 1000 records at a time

def parse_date(date_str):
    """Parse date string - handles multiple formats"""
    if pd.isna(date_str) or date_str == '' or str(date_str).strip() == '':
        return None
    try:
        # Try MM/DD/YYYY format first
        if isinstance(date_str, str):
            return datetime.strptime(date_str.strip(), '%m/%d/%Y').date()
        # If it's already a datetime object
        elif isinstance(date_str, datetime):
            return date_str.date()
        # If it's a pandas Timestamp
        elif hasattr(date_str, 'date'):
            return date_str.date()
    except:
        try:
            # Try parsing as pandas datetime
            return pd.to_datetime(date_str).date()
        except:
            return None

def clean_string(value):
    """Clean string values - remove extra spaces, handle NaN"""
    if pd.isna(value):
        return None
    if isinstance(value, (int, float)):
        return str(value).strip()
    return str(value).strip() if value else None

def import_excel_batch():
    """Import Excel data in batches"""
    print(f"Reading Excel file: {EXCEL_FILE}")
    
    if not os.path.exists(EXCEL_FILE):
        print(f"Error: Excel file not found at {EXCEL_FILE}")
        return
    
    # Read Excel file
    try:
        df = pd.read_excel(EXCEL_FILE)
        print(f"SUCCESS: Excel file loaded. Total rows: {len(df)}")
        print(f"Columns: {list(df.columns)}")
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return
    
    # Map Excel columns to database columns
    column_mapping = {
        'Inspection ID': 'InspectionID',
        'FEI Number': 'FEINumber',
        'Legal Name': 'LegalName',
        'Inspection End Date': 'InspectionEndDate',
        'Program Area': 'ProgramArea',
        'Act/CFR Number': 'ActCFRNumber',
        'Short Description': 'ShortDescription',
        'Long Description': 'LongDescription'
    }
    
    # Rename columns to match database
    df = df.rename(columns=column_mapping)
    
    # Ensure all required columns exist
    required_columns = ['InspectionID', 'FEINumber']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        print(f"Error: Missing required columns: {missing_columns}")
        return
    
    db = SessionLocal()
    total_inserted = 0
    total_skipped = 0
    total_errors = 0
    
    try:
        # Process in batches
        total_batches = (len(df) + BATCH_SIZE - 1) // BATCH_SIZE
        
        for batch_num in range(total_batches):
            start_idx = batch_num * BATCH_SIZE
            end_idx = min((batch_num + 1) * BATCH_SIZE, len(df))
            batch_df = df.iloc[start_idx:end_idx]
            
            print(f"\nProcessing batch {batch_num + 1}/{total_batches} (rows {start_idx + 1}-{end_idx})...")
            
            batch_records = []
            for idx, row in batch_df.iterrows():
                try:
                    # Skip if InspectionID is missing or invalid
                    inspection_id = row.get('InspectionID')
                    if pd.isna(inspection_id):
                        total_skipped += 1
                        continue
                    
                    # Convert to int
                    try:
                        inspection_id = int(float(inspection_id))
                    except:
                        total_skipped += 1
                        continue
                    
                    # Check if record already exists
                    existing = db.query(Observation).filter(
                        Observation.InspectionID == inspection_id
                    ).first()
                    
                    if existing:
                        total_skipped += 1
                        continue
                    
                    # Create observation record
                    observation = Observation(
                        InspectionID=inspection_id,
                        FEINumber=clean_string(row.get('FEINumber', '')),
                        LegalName=clean_string(row.get('LegalName')),
                        InspectionEndDate=parse_date(row.get('InspectionEndDate')),
                        ProgramArea=clean_string(row.get('ProgramArea')),
                        ActCFRNumber=clean_string(row.get('ActCFRNumber')),
                        ShortDescription=clean_string(row.get('ShortDescription')),
                        LongDescription=clean_string(row.get('LongDescription'))
                    )
                    
                    batch_records.append(observation)
                    
                except Exception as e:
                    total_errors += 1
                    print(f"  Warning: Error processing row {idx + 1}: {e}")
                    continue
            
            # Insert records one by one to handle duplicates gracefully
            if batch_records:
                batch_inserted = 0
                batch_skipped = 0
                for record in batch_records:
                    try:
                        # Check if record already exists
                        existing = db.query(Observation).filter(
                            Observation.InspectionID == record.InspectionID
                        ).first()
                        
                        if existing:
                            batch_skipped += 1
                            total_skipped += 1
                            continue
                        
                        # Insert the record
                        db.add(record)
                        db.commit()
                        batch_inserted += 1
                        total_inserted += 1
                    except Exception as e:
                        db.rollback()
                        # If it's a duplicate key error (SQL error 23000), skip it
                        error_str = str(e).lower()
                        if 'duplicate key' in error_str or 'primary key' in error_str or '23000' in str(e):
                            batch_skipped += 1
                            total_skipped += 1
                        else:
                            total_errors += 1
                            if total_errors <= 5:  # Only show first 5 errors to avoid spam
                                print(f"  Warning: Error inserting record {record.InspectionID}: {str(e)[:100]}")
                
                if batch_inserted > 0:
                    print(f"  SUCCESS: Inserted {batch_inserted} records, skipped {batch_skipped} duplicates")
                else:
                    print(f"  Skipped {batch_skipped} duplicate records in this batch")
            
            # Progress update
            progress = ((batch_num + 1) / total_batches) * 100
            print(f"  Progress: {progress:.1f}% | Total inserted: {total_inserted} | Skipped: {total_skipped} | Errors: {total_errors}")
        
        print(f"\n{'='*60}")
        print(f"Import completed!")
        print(f"  Total records processed: {len(df)}")
        print(f"  Successfully inserted: {total_inserted}")
        print(f"  Skipped (duplicates/missing): {total_skipped}")
        print(f"  Errors: {total_errors}")
        print(f"{'='*60}")
        
    except Exception as e:
        db.rollback()
        print(f"Error during import: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    try:
        import_excel_batch()
    except Exception as e:
        print(f"Failed to import data: {e}")
        raise
