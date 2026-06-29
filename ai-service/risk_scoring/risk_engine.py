"""Offender risk scoring engine — weighted rule-based + ML hybrid."""

from __future__ import annotations
import uuid
from datetime import datetime
from risk_scoring.feature_engineering import OffenderProfile

# Weights for each feature in the composite risk score
FEATURE_WEIGHTS: dict[str, float] = {
    "prior_offense_risk":   0.28,
    "crime_severity_risk":  0.22,
    "weapon_risk":          0.15,
    "gang_risk":            0.12,
    "district_risk":        0.10,
    "age_risk":             0.07,
    "recidivism_risk":      0.04,
    "gender_risk":          0.02,
}

# In-memory store for scored cases (keyed by case_id)
_SCORED_CASES: dict[str, dict] = {}


def compute_risk_score(profile: OffenderProfile) -> dict:
    """
    Compute a composite risk score (0–100) for an offender profile.

    Returns a structured result including score, level, breakdown, and case_id.
    """
    features = profile.to_feature_vector()

    # Weighted sum
    raw_score = sum(features[feat] * weight for feat, weight in FEATURE_WEIGHTS.items())

    # Normalise to 0–100
    score = round(min(raw_score * 100, 100), 2)

    risk_level = _score_to_level(score)
    case_id = str(uuid.uuid4())[:8].upper()

    result = {
        "case_id": case_id,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "risk_score": score,
        "risk_level": risk_level,
        "feature_scores": features,
        "feature_weights": FEATURE_WEIGHTS,
        "input_profile": {
            "offender_age": profile.offender_age,
            "offender_gender": profile.offender_gender,
            "prior_offenses": profile.prior_offenses,
            "weapon_used": profile.weapon_used,
            "gang_related": profile.gang_related,
            "crime_type": profile.crime_type,
            "district": profile.district,
        },
        "recommendation": _get_recommendation(risk_level),
    }

    # Cache for explain endpoint
    _SCORED_CASES[case_id] = result
    return result


def get_scored_case(case_id: str) -> dict | None:
    """Retrieve a previously scored case by ID."""
    return _SCORED_CASES.get(case_id)


def _score_to_level(score: float) -> str:
    if score >= 75:
        return "Critical"
    elif score >= 55:
        return "High"
    elif score >= 35:
        return "Medium"
    else:
        return "Low"


def _get_recommendation(level: str) -> str:
    mapping = {
        "Critical": "Immediate detention evaluation and psychological assessment recommended.",
        "High": "Heightened supervision; recommend pre-trial detention review.",
        "Medium": "Community supervision with regular check-ins; counselling recommended.",
        "Low": "Standard monitoring; consider diversion programs.",
    }
    return mapping.get(level, "Review case manually.")
