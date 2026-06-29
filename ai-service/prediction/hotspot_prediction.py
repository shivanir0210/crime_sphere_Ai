"""Hotspot prediction using Random Forest Classifier."""

from __future__ import annotations
import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

from utils.load_data import load_crimes_df

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

# Feature columns used by the model
FEATURE_COLS = ["latitude", "longitude", "time_of_day_enc", "season_enc", "district_enc"]
TARGET_COL = "is_hotspot"

# Encoders (fitted on training data; persisted with the model bundle)
_ENCODERS: dict[str, LabelEncoder] = {}
_MODEL: RandomForestClassifier | None = None


def _label_encode(df: pd.DataFrame, col: str, encoder: LabelEncoder) -> pd.Series:
    """Safely encode unseen labels as -1."""
    known = set(encoder.classes_)
    return df[col].apply(lambda x: encoder.transform([x])[0] if x in known else -1)


def _build_training_data(df: pd.DataFrame):
    """Create a feature matrix and target vector for training."""
    # Define hotspot: districts with above-median crime count
    district_counts = df["district"].value_counts()
    median_count = district_counts.median()
    hotspot_districts = set(district_counts[district_counts >= median_count].index)
    df = df.copy()
    df[TARGET_COL] = df["district"].isin(hotspot_districts).astype(int)

    encoders = {}
    for col in ("time_of_day", "season", "district"):
        le = LabelEncoder()
        df[f"{col}_enc"] = le.fit_transform(df[col])
        encoders[col] = le

    X = df[FEATURE_COLS].values
    y = df[TARGET_COL].values
    return X, y, encoders


def train_model() -> dict:
    """Train the Random Forest model and persist to disk."""
    global _MODEL, _ENCODERS

    df = load_crimes_df()
    X, y, encoders = _build_training_data(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=8,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1,
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)

    bundle = {"model": clf, "encoders": encoders}
    joblib.dump(bundle, MODEL_PATH)

    _MODEL = clf
    _ENCODERS = encoders

    return {
        "accuracy": round(acc, 4),
        "classification_report": report,
        "feature_importances": dict(zip(FEATURE_COLS, clf.feature_importances_.round(4).tolist())),
    }


def load_model():
    """Load the persisted model bundle from disk."""
    global _MODEL, _ENCODERS
    if not os.path.exists(MODEL_PATH):
        train_model()
        return
    bundle = joblib.load(MODEL_PATH)
    _MODEL = bundle["model"]
    _ENCODERS = bundle["encoders"]


def predict_hotspot(
    latitude: float,
    longitude: float,
    time_of_day: str,
    season: str,
    district: str,
) -> dict:
    """Predict whether a location/time combination is a crime hotspot."""
    global _MODEL, _ENCODERS

    if _MODEL is None:
        load_model()

    def encode_val(col: str, val: str) -> int:
        enc = _ENCODERS.get(col)
        if enc is None:
            return 0
        known = set(enc.classes_)
        return int(enc.transform([val])[0]) if val in known else 0

    features = np.array([[
        latitude,
        longitude,
        encode_val("time_of_day", time_of_day),
        encode_val("season", season),
        encode_val("district", district),
    ]])

    prob = _MODEL.predict_proba(features)[0]
    prediction = int(_MODEL.predict(features)[0])
    hotspot_prob = round(float(prob[1]), 4)

    risk_level = (
        "High" if hotspot_prob >= 0.7
        else "Medium" if hotspot_prob >= 0.4
        else "Low"
    )

    importances = dict(zip(FEATURE_COLS, _MODEL.feature_importances_.round(4).tolist()))

    return {
        "is_hotspot": bool(prediction),
        "hotspot_probability": hotspot_prob,
        "risk_level": risk_level,
        "input": {
            "latitude": latitude,
            "longitude": longitude,
            "time_of_day": time_of_day,
            "season": season,
            "district": district,
        },
        "model_feature_importances": importances,
    }
