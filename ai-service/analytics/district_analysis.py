"""District-level crime analysis."""

from __future__ import annotations
import pandas as pd
from utils.load_data import load_crimes_df
from utils.helpers import safe_round, percentage


def get_district_analysis(district: str | None = None) -> dict:
    df = load_crimes_df()

    if district:
        df_filtered = df[df["district"].str.lower() == district.lower()]
        if df_filtered.empty:
            return {"error": f"No data found for district: {district}"}
        df = df_filtered

    total = len(df)

    # Crime count per district
    district_counts = df["district"].value_counts().reset_index()
    district_counts.columns = ["district", "total_crimes"]

    # Average severity per district
    severity = df.groupby("district")["severity_score"].mean().round(2).reset_index()
    severity.columns = ["district", "avg_severity"]

    # Arrest rate per district
    arrest = df.groupby("district")["arrest_made"].mean().mul(100).round(2).reset_index()
    arrest.columns = ["district", "arrest_rate_pct"]

    # Top crime per district
    top_crime_per_district = (
        df.groupby(["district", "crime_type"])
        .size()
        .reset_index(name="count")
        .sort_values("count", ascending=False)
        .drop_duplicates("district")
        .rename(columns={"crime_type": "top_crime_type", "count": "top_crime_count"})
    )

    # Merge into one table
    summary = district_counts.merge(severity, on="district")
    summary = summary.merge(arrest, on="district")
    summary = summary.merge(
        top_crime_per_district[["district", "top_crime_type", "top_crime_count"]],
        on="district",
        how="left",
    )
    summary = summary.sort_values("total_crimes", ascending=False)
    district_records = summary.to_dict(orient="records")

    # Crime type breakdown per district (pivot)
    crime_pivot = (
        df.groupby(["district", "crime_type"])
        .size()
        .reset_index(name="count")
        .to_dict(orient="records")
    )

    # Time of day per district
    time_by_district = (
        df.groupby(["district", "time_of_day"])
        .size()
        .reset_index(name="count")
        .to_dict(orient="records")
    )

    # Hotspot coords (mean lat/lon per district)
    hotspots = (
        df.groupby("district")
        .agg(lat=("latitude", "mean"), lon=("longitude", "mean"), incidents=("case_id", "count"))
        .round(6)
        .reset_index()
        .to_dict(orient="records")
    )

    return {
        "total_cases_in_scope": total,
        "district_summary": district_records,
        "crime_type_by_district": crime_pivot,
        "time_of_day_by_district": time_by_district,
        "district_hotspot_coordinates": hotspots,
    }
