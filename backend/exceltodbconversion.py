import pandas as pd


input_file = "capa_in_db.xlsx"
output_file = "capa_in_db_op.xlsx"

df = pd.read_excel(
    input_file,
    dtype={
        "obs_id": str
    }
)


df.columns = df.columns.str.strip()


def sql_value(val, is_date=False):
    if pd.isna(val) or val == "":
        return "NULL"
    if is_date:
        return f"'{val.strftime('%Y-%m-%d')}'"
    return "'" + str(val).replace("'", "''") + "'"


def generate_insert(row):
    return (
        "INSERT INTO CAPARecords "
        "(obs_id, Act_CFR_Number, Long_Description, Immediate_Actions, "
        "Extensive_Investigation_Probable_Contributing_Factors, "
        "Corrective_Actions, Preventive_Actions, CAPA_Effectiveness_Monitoring) VALUES ("
        f"{sql_value(row['obs_id'])},"
        f"{sql_value(row['Act/CFR Number'])},"
        f"{sql_value(row['Long Description'])},"
        f"{sql_value(row['Immediate Actions'])},"
        f"{sql_value(row['Extensive Investigation - Probable Contributing Factors'])},"
        f"{sql_value(row['Corrective Actions'])},"
        f"{sql_value(row['Preventive Actions'])},"
        f"{sql_value(row['CAPA Effectiveness Monitoring'])}"
        ");"
    )


df["Insert_SQL"] = df.apply(generate_insert, axis=1)

df.to_excel(output_file, index=False)

print("✅ Output Excel created:", output_file)
