import pandas as pd

# -----------------------------
# Load Excel
# -----------------------------
input_file = "2,69,504_483_systemwise.xlsx"
output_file = "2,69,504_483_systemwise_db_op.xlsx"

df = pd.read_excel(input_file)

# -----------------------------
# Normalize column names
# -----------------------------
df.columns = df.columns.str.strip()

# -----------------------------
# Convert date columns safely
# -----------------------------
date_columns = ["Inspection End Date", "Matched_Record_Date"]

for col in date_columns:
    if col in df.columns:
        df[col] = pd.to_datetime(df[col], errors="coerce")

# -----------------------------
# Helper function for SQL values
# -----------------------------
def sql_value(val, is_date=False):
    if pd.isna(val) or val == "":
        return "NULL"
    if is_date:
        return f"'{val.strftime('%Y-%m-%d')}'"
    return "'" + str(val).replace("'", "''") + "'"

# -----------------------------
# Generate INSERT statement
# -----------------------------
# def generate_insert(row):
#     return f"""INSERT INTO ObservationsAlongWith483 (
# InspectionID, FEINumber, LegalName, InspectionEndDate, ProgramArea,
# ActCFRNumber, System, ShortDescription, LongDescription,
# Matched_FEI_Number, Matched_Record_Date, DownloadURL
# ) VALUES (
# {row['Inspection ID']},
# {sql_value(row['FEI Number'])},
# {sql_value(row['Legal Name'])},
# {sql_value(row['Inspection End Date'], True)},
# {sql_value(row['Program Area'])},
# {sql_value(row['Act/CFR Number'])},
# {sql_value(row['System'])},
# {sql_value(row['Short Description'])},
# {sql_value(row['Long Description'])},
# {sql_value(row.get('Matched_FEI_Number'))},
# {sql_value(row.get('Matched_Record_Date'), True)},
# {sql_value(row.get('Download URL'))}
# );"""
def generate_insert(row):
    return (
        "INSERT INTO ObservationsAlongWith483 "
        "(InspectionID, FEINumber, LegalName, InspectionEndDate, ProgramArea, "
        "ActCFRNumber, System, ShortDescription, LongDescription, "
        "Matched_FEI_Number, Matched_Record_Date, DownloadURL) VALUES ("
        f"{row['Inspection ID']},"
        f"{sql_value(row['FEI Number'])},"
        f"{sql_value(row['Legal Name'])},"
        f"{sql_value(row['Inspection End Date'], True)},"
        f"{sql_value(row['Program Area'])},"
        f"{sql_value(row['Act/CFR Number'])},"
        f"{sql_value(row['System'])},"
        f"{sql_value(row['Short Description'])},"
        f"{sql_value(row['Long Description'])},"
        f"{sql_value(row.get('Matched_FEI_Number'))},"
        f"{sql_value(row.get('Matched_Record_Date'), True)},"
        f"{sql_value(row.get('Download URL'))});"
    )


# -----------------------------
# Apply & create new column
# -----------------------------
df["Insert_SQL"] = df.apply(generate_insert, axis=1)

# -----------------------------
# Save output
# -----------------------------
df.to_excel(output_file, index=False)

print("✅ Output Excel created:", output_file)
