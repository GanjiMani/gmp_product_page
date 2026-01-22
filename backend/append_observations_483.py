"""
Append rows from Excel into ObservationsAlongWith483 table.
Reads: backend\2,69,504_483_systemwise_db_op.xlsx
Skips the Insert_SQL column.
"""
import os
from datetime import datetime
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Load environment variables
load_dotenv()

DB_SERVER = os.getenv("DB_SERVER")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

if not all([DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD]):
    raise RuntimeError("Database environment variables are not fully set")

DB_PASSWORD_Q = quote_plus(DB_PASSWORD)
DATABASE_URL = (
    f"mssql+pyodbc://{DB_USER}:{DB_PASSWORD_Q}@{DB_SERVER}:1433/"
    f"{DB_NAME}?driver=ODBC+Driver+17+for+SQL+Server"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    future=True
)

# Excel file path (located in backend folder)
EXCEL_PATH = r".\2,69,504_483_systemwise_db_op.xlsx"

# Map Excel columns to DB columns
COLUMN_MAP = {
    "Inspection ID": "InspectionID",
    "FEI Number": "FEINumber",
    "Legal Name": "LegalName",
    "Inspection End Date": "InspectionEndDate",
    "Program Area": "ProgramArea",
    "Act/CFR Number": "ActCFRNumber",
    "System": "System",
    "Short Description": "ShortDescription",
    "Long Description": "LongDescription",
    "Matched_FEI_Number": "Matched_FEI_Number",
    "Matched_Record_Date": "Matched_Record_Date",
    "Download URL": "DownloadURL",
}

def parse_date(val):
    if pd.isna(val) or val == "":
        return None
    try:
        if isinstance(val, datetime):
            return val.date()
        return pd.to_datetime(val).date()
    except Exception:
        return None

def main():
    print(f"Reading Excel: {EXCEL_PATH}")
    df = pd.read_excel(EXCEL_PATH)
    print(f"Rows loaded: {len(df)}")

    # Rename columns
    df = df.rename(columns=COLUMN_MAP)

    # Keep only mapped columns (drop Insert_SQL and any others)
    df = df[list(COLUMN_MAP.values())]

    # Coerce types
    df["InspectionID"] = pd.to_numeric(df["InspectionID"], errors="coerce").astype("Int64")
    df["FEINumber"] = df["FEINumber"].astype(str)
    df["InspectionEndDate"] = df["InspectionEndDate"].apply(parse_date)
    df["Matched_Record_Date"] = df["Matched_Record_Date"].apply(parse_date)

    # Drop rows without InspectionID
    before = len(df)
    df = df.dropna(subset=["InspectionID"])
    after = len(df)
    if before != after:
        print(f"Dropped {before - after} rows with missing InspectionID")

    # Insert into DB
    print("Appending to ObservationsAlongWith483 ...")
    df.to_sql(
        "ObservationsAlongWith483",
        con=engine,
        if_exists="append",
        index=False,
        chunksize=500,   # smaller batches
        method=None      # single-row inserts to avoid pyodbc COUNT field issues
    )
    print("✅ Data appended successfully")

if __name__ == "__main__":
    main()
