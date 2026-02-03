import pandas as pd
from database import SessionLocal
from models import CAPARecord
import os

EXCEL_FILE = "capa_in_db_op.xlsx"
BATCH_SIZE = 1000


def clean_string(value):
    if pd.isna(value):
        return None
    return str(value).strip()


def import_capa_records():
    print("🚀 Starting CAPARecords import...")

    if not os.path.exists(EXCEL_FILE):
        print("❌ Excel file not found")
        return

    # 🔑 READ EXCEL (KEEP obs_id AS STRING → PRESERVES 00001)
    df = pd.read_excel(EXCEL_FILE, dtype={"obs_id": str})
    print(f"📄 Total rows found: {len(df)}")

    # 🔑 RENAME EXCEL COLUMNS → MATCH MODEL EXACTLY
    df = df.rename(columns={
        "Act/CFR Number": "Act_CFR_Number",
        "Long Description": "Long_Description",
        "Immediate Actions": "Immediate_Actions",
        "Extensive Investigation - Probable Contributing Factors":
            "Extensive_Investigation_Probable_Contributing_Factors",
        "Corrective Actions": "Corrective_Actions",
        "Preventive Actions": "Preventive_Actions",
        "CAPA Effectiveness Monitoring": "CAPA_Effectiveness_Monitoring"
    })

    db = SessionLocal()
    total_inserted = 0

    try:
        total_batches = (len(df) + BATCH_SIZE - 1) // BATCH_SIZE

        for batch_num in range(total_batches):
            start = batch_num * BATCH_SIZE
            end = min(start + BATCH_SIZE, len(df))
            batch_df = df.iloc[start:end]

            print(f"➡️ Batch {batch_num + 1}/{total_batches} ({start + 1}-{end})")

            records = []
            for _, row in batch_df.iterrows():
                if not row.get("obs_id"):
                    continue

                record = CAPARecord(
                    obs_id=clean_string(row["obs_id"]),
                    Act_CFR_Number=clean_string(row.get("Act_CFR_Number")),
                    Long_Description=clean_string(row.get("Long_Description")),
                    Immediate_Actions=clean_string(row.get("Immediate_Actions")),
                    Extensive_Investigation_Probable_Contributing_Factors=clean_string(
                        row.get("Extensive_Investigation_Probable_Contributing_Factors")
                    ),
                    Corrective_Actions=clean_string(row.get("Corrective_Actions")),
                    Preventive_Actions=clean_string(row.get("Preventive_Actions")),
                    CAPA_Effectiveness_Monitoring=clean_string(
                        row.get("CAPA_Effectiveness_Monitoring")
                    ),
                )

                records.append(record)

            # 🚀 FAST BULK INSERT
            if records:
                db.bulk_save_objects(records)
                db.commit()
                total_inserted += len(records)

            print(f"✅ Inserted so far: {total_inserted}")

        print("\n🎉 IMPORT COMPLETED SUCCESSFULLY")
        print(f"📊 Total inserted: {total_inserted}")

    except Exception as e:
        db.rollback()
        print("❌ Import failed:", e)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import_capa_records()
