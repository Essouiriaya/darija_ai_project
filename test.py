import pandas as pd
import os

# 👉 CHANGE THESE PATHS to your real local files
base_path = r"C:\Users\user\Downloads\v1\darija-ai-translator-clean\ai_models\translation_model\names"

male_df = pd.read_csv(base_path + r"\male_names.csv")
female_df = pd.read_csv(base_path + r"\female_names.csv")


print("🔍 CHECKING FILES...\n")

# =====================
# 1. Check if files exist
# =====================
print("Male file exists:", os.path.exists(male_path))
print("Female file exists:", os.path.exists(female_path))

print("\n====================\n")

# =====================
# 2. Load CSVs
# =====================
male_df = pd.read_csv(male_path)
female_df = pd.read_csv(female_path)

# =====================
# 3. Show raw structure
# =====================
print("MALE DF SHAPE:", male_df.shape)
print("FEMALE DF SHAPE:", female_df.shape)

print("\nMALE COLUMNS:", male_df.columns)
print("FEMALE COLUMNS:", female_df.columns)

print("\n====================\n")

# =====================
# 4. Preview data
# =====================
print("MALE HEAD:")
print(male_df.head())

print("\nFEMALE HEAD:")
print(female_df.head())

print("\n====================\n")

# =====================
# 5. Try BOTH formats safely
# =====================

print("TRYING latin_name / darija_name...\n")

try:
    print("Male latin_name exists:", "latin_name" in male_df.columns)
    print("Female latin_name exists:", "latin_name" in female_df.columns)

    latin_names = set(
        male_df["latin_name"].dropna().astype(str).str.lower().tolist() +
        female_df["latin_name"].dropna().astype(str).str.lower().tolist()
    )

    print("\n✅ latin_name WORKS!")
    print("Sample:", list(latin_names)[:10])

except Exception as e:
    print("\n❌ latin_name FAILED")
    print("Error:", e)

print("\n====================\n")

print("TRYING male_name / female_name...\n")

try:
    male_names = male_df["male_name"].dropna().tolist()
    female_names = female_df["female_name"].dropna().tolist()

    print("\n✅ male_name format WORKS!")
    print("Sample male:", male_names[:5])

except Exception as e:
    print("\n❌ male_name FAILED")
    print("Error:", e)