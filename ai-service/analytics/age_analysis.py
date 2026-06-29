"""Age-based crime analysis."""

from __future__ import annotations
import pandas as pd
from utils.load_data import load_crimes_df
from utils.helpers import safe_round


AGE_BINS = [0, 17, 24, 34, 44, 54, 64, 120]
AGE_LABELS = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"]


def _bin_age(df: pd.DataFrame, col: str) -> pd.Series:
    return pd.cut(df[col], bins=AGE_BINS, labels=AGE_LABELS, right=True)


def get_age_analysis() -> dict:
    df = load_crimes_df()

    # Offender age distribution
    df["offender_age_group"] = _bin_age(df, "offender_age")
    offender_dist = df["offender_age_group"].value_counts().sort_index().to_dict()
    offender_dist = {str(k): int(v) for k, v in offender_dist.items()}

    # Victim age distribution
    df["victim_age_group"] = _bin_age(df, "victim_age")
    victim_dist = df["victim_age_group"].value_counts().sort_index().to_dict()
    victim_dist = {str(k): int(v) for k, v in victim_dist.items()}

    # Age group vs crime type
    age_crime = (
        df.groupby(["offender_age_group", "crime_type"], observed=True)
        .size()
        .reset_index(name="count")
    )
    age_crime["offender_age_group"] = age_crime["offender_age_group"].astype(str)
    age_crime_records = age_crime.to_dict(orient="records")

    # Stats
    stats = {
        "offender": {
            "mean_age": safe_round(df["offender_age"].mean()),
            "median_age": safe_round(df["offender_age"].median()),
            "min_age": int(df["offender_age"].min()),
            "max_age": int(df["offender_age"].max()),
        },
        "victim": {
            "mean_age": safe_round(df["victim_age"].mean()),
            "median_age": safe_round(df["victim_age"].median()),
            "min_age": int(df["victim_age"].min()),
            "max_age": int(df["victim_age"].max()),
        },
    }

    # Recidivism by age group
    recid = (
        df.groupby("offender_age_group", observed=True)["recidivism"]
        .mean()
        .mul(100)
        .round(2)
        .reset_index()
    )
    recid.columns = ["age_group", "recidivism_rate_pct"]
    recid["age_group"] = recid["age_group"].astype(str)
    recidivism_by_age = recid.to_dict(orient="records")

    return {
        "offender_age_distribution": offender_dist,
        "victim_age_distribution": victim_dist,
        "age_vs_crime_type": age_crime_records,
        "statistics": stats,
        "recidivism_by_age_group": recidivism_by_age,
    }
