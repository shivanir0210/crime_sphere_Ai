"""Data loading utilities with caching."""

import os
import pandas as pd
from functools import lru_cache


DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "dataset", "crimes.csv")


@lru_cache(maxsize=1)
def load_crimes_df() -> pd.DataFrame:
    """Load and cache the crimes dataset. Applies basic type coercions."""
    path = os.path.abspath(DATA_PATH)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset not found at: {path}")

    df = pd.read_csv(path, parse_dates=["date"])

    # Normalise boolean-like columns
    for col in ("recidivism", "arrest_made", "weapon_used", "gang_related"):
        if col in df.columns:
            df[col] = df[col].map({"Yes": True, "No": False}).fillna(False).astype(bool)

    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    df["month_name"] = df["date"].dt.strftime("%B")

    return df


def reload_data() -> pd.DataFrame:
    """Force-reload the dataset (clears cache)."""
    load_crimes_df.cache_clear()
    return load_crimes_df()
