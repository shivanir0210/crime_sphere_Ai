"""High-level crime summary and trend analytics."""

from __future__ import annotations
import pandas as pd
from utils.load_data import load_crimes_df
from utils.helpers import series_to_dict, safe_round, percentage


def get_summary() -> dict:
    """Return an overall summary of the crime dataset."""
    df = load_crimes_df()
    total = len(df)

    top_crime = df["crime_type"].value_counts().idxmax()
    top_district = df["district"].value_counts().idxmax()
    avg_severity = safe_round(df["severity_score"].mean())
    arrest_rate = percentage(df["arrest_made"].sum(), total)
    weapon_rate = percentage(df["weapon_used"].sum(), total)
    gang_rate = percentage(df["gang_related"].sum(), total)
    recidivism_rate = percentage(df["recidivism"].sum(), total)

    crime_type_dist = series_to_dict(df["crime_type"].value_counts())
    district_dist = series_to_dict(df["district"].value_counts())
    time_dist = series_to_dict(df["time_of_day"].value_counts())
    season_dist = series_to_dict(df["season"].value_counts())

    return {
        "total_cases": total,
        "top_crime_type": top_crime,
        "top_district": top_district,
        "average_severity_score": avg_severity,
        "arrest_rate_pct": arrest_rate,
        "weapon_involvement_pct": weapon_rate,
        "gang_related_pct": gang_rate,
        "recidivism_rate_pct": recidivism_rate,
        "crime_type_distribution": crime_type_dist,
        "district_distribution": district_dist,
        "time_of_day_distribution": time_dist,
        "season_distribution": season_dist,
    }


def get_trends(group_by: str = "month") -> dict:
    """Return crime counts grouped by time period."""
    df = load_crimes_df()

    if group_by == "year":
        trend = df.groupby("year").size().reset_index(name="count")
        trend["period"] = trend["year"].astype(str)
    elif group_by == "season":
        trend = df.groupby("season").size().reset_index(name="count")
        trend["period"] = trend["season"]
    elif group_by == "time_of_day":
        trend = df.groupby("time_of_day").size().reset_index(name="count")
        trend["period"] = trend["time_of_day"]
    else:
        # default: month
        trend = df.groupby(["year", "month", "month_name"]).size().reset_index(name="count")
        trend["period"] = trend["month_name"] + " " + trend["year"].astype(str)

    records = trend[["period", "count"]].to_dict(orient="records")

    # Also include per crime_type trend
    crime_trend = (
        df.groupby(["crime_type"])
        .agg(total=("case_id", "count"), avg_severity=("severity_score", "mean"))
        .reset_index()
    )
    crime_trend["avg_severity"] = crime_trend["avg_severity"].round(2)
    crime_records = crime_trend.to_dict(orient="records")

    return {
        "group_by": group_by,
        "trend": records,
        "crime_type_summary": crime_records,
    }
