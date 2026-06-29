"""Gender-based crime analysis."""

from __future__ import annotations
import pandas as pd
from utils.load_data import load_crimes_df
from utils.helpers import safe_round, percentage


def get_gender_analysis() -> dict:
    df = load_crimes_df()
    total = len(df)

    # Offender gender breakdown
    offender_gender = df["offender_gender"].value_counts().to_dict()
    offender_gender_pct = {
        g: percentage(c, total) for g, c in offender_gender.items()
    }

    # Victim gender breakdown
    victim_gender = df["victim_gender"].value_counts().to_dict()
    victim_gender_pct = {
        g: percentage(c, total) for g, c in victim_gender.items()
    }

    # Crime type by offender gender
    crime_by_gender = (
        df.groupby(["offender_gender", "crime_type"])
        .size()
        .reset_index(name="count")
        .to_dict(orient="records")
    )

    # Severity by gender
    severity_by_gender = (
        df.groupby("offender_gender")["severity_score"]
        .agg(["mean", "max", "min"])
        .round(2)
        .reset_index()
        .rename(columns={"mean": "avg_severity", "max": "max_severity", "min": "min_severity"})
        .to_dict(orient="records")
    )

    # Recidivism by gender
    recid_by_gender = (
        df.groupby("offender_gender")["recidivism"]
        .mean()
        .mul(100)
        .round(2)
        .reset_index()
    )
    recid_by_gender.columns = ["gender", "recidivism_rate_pct"]
    recid_by_gender = recid_by_gender.to_dict(orient="records")

    # Weapon use by gender
    weapon_by_gender = (
        df.groupby("offender_gender")["weapon_used"]
        .mean()
        .mul(100)
        .round(2)
        .reset_index()
    )
    weapon_by_gender.columns = ["gender", "weapon_use_pct"]
    weapon_by_gender = weapon_by_gender.to_dict(orient="records")

    # Arrest rate by offender gender
    arrest_by_gender = (
        df.groupby("offender_gender")["arrest_made"]
        .mean()
        .mul(100)
        .round(2)
        .reset_index()
    )
    arrest_by_gender.columns = ["gender", "arrest_rate_pct"]
    arrest_by_gender = arrest_by_gender.to_dict(orient="records")

    return {
        "offender_gender_counts": offender_gender,
        "offender_gender_percentages": offender_gender_pct,
        "victim_gender_counts": victim_gender,
        "victim_gender_percentages": victim_gender_pct,
        "crime_type_by_offender_gender": crime_by_gender,
        "severity_by_offender_gender": severity_by_gender,
        "recidivism_by_gender": recid_by_gender,
        "weapon_use_by_gender": weapon_by_gender,
        "arrest_rate_by_offender_gender": arrest_by_gender,
    }
