import pandas as pd

INSPECTION_FILE = "2,69,054_data.xlsx"
LOOKUP_FILE = "1915__483warningletters.xlsx"
OUTPUT_FILE = "2,69,054_with_483warningletters.xlsx"

print("Loading inspection Excel file...")
df_inspection = pd.read_excel(INSPECTION_FILE)
print(f"Inspection file loaded with {len(df_inspection)} rows")

print("\nLoading lookup Excel file...")
df_lookup = pd.read_excel(LOOKUP_FILE)
print(f"Lookup file loaded with {len(df_lookup)} rows")

# -----------------------------
# Clean column names
# -----------------------------
df_inspection.columns = df_inspection.columns.str.strip()
df_lookup.columns = df_lookup.columns.str.strip()

# -----------------------------
# FIX FEI NUMBER ISSUE
# -----------------------------
def clean_fei(x):
    if pd.isna(x):
        return None
    return str(int(float(x)))

df_inspection["FEI Number"] = df_inspection["FEI Number"].apply(clean_fei)
df_lookup["FEI Number"] = df_lookup["FEI Number"].apply(clean_fei)

# -----------------------------
# DATE NORMALIZATION
# -----------------------------
df_inspection["Inspection End Date"] = (
    pd.to_datetime(df_inspection["Inspection End Date"], errors="coerce")
    .dt.normalize()
)

df_lookup["Record Date"] = (
    pd.to_datetime(df_lookup["Record Date"], errors="coerce")
    .dt.normalize()
)

# -----------------------------
# RENAME LOOKUP COLUMNS
# (for clarity in output)
# -----------------------------
df_lookup.rename(
    columns={
        "FEI Number": "Matched_FEI_Number",
        "Record Date": "Matched_Record_Date"
    },
    inplace=True
)

print("\nSample inspection data:")
print(df_inspection[["FEI Number", "Inspection End Date"]].head(3))

print("\nSample lookup data:")
print(df_lookup[["Matched_FEI_Number", "Matched_Record_Date"]].head(3))

# -----------------------------
# MERGE (FEI + DATE)
# -----------------------------
print("\nStarting merge...")
merged_df = df_inspection.merge(
    df_lookup[
        ["Matched_FEI_Number", "Matched_Record_Date", "Download"]
    ],
    left_on=["FEI Number", "Inspection End Date"],
    right_on=["Matched_FEI_Number", "Matched_Record_Date"],
    how="left"
)

# -----------------------------
# RENAME FINAL COLUMN
# -----------------------------
merged_df.rename(
    columns={"Download": "Download URL"},
    inplace=True
)

# -----------------------------
# MERGE STATS
# -----------------------------
total = len(merged_df)
matched = merged_df["Download URL"].notna().sum()

print("\nMerge completed!")
print(f"Total rows        : {total}")
print(f"Matched URLs      : {matched}")
print(f"Unmatched rows    : {total - matched}")

# -----------------------------
# SAVE OUTPUT
# -----------------------------
merged_df.to_excel(OUTPUT_FILE, index=False)
print(f"\nOutput saved to: {OUTPUT_FILE}")
