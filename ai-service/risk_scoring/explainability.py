"""Explainability layer — feature contribution breakdown for risk scores."""

from __future__ import annotations
from risk_scoring.risk_engine import get_scored_case, FEATURE_WEIGHTS

FEATURE_LABELS: dict[str, str] = {
    "prior_offense_risk":   "Prior Criminal Offenses",
    "crime_severity_risk":  "Severity of Current Crime",
    "weapon_risk":          "Weapon Involvement",
    "gang_risk":            "Gang Affiliation",
    "district_risk":        "High-Risk District",
    "age_risk":             "Age Risk Factor",
    "recidivism_risk":      "History of Recidivism",
    "gender_risk":          "Gender Risk Factor",
}

FEATURE_DESCRIPTIONS: dict[str, str] = {
    "prior_offense_risk":   "Number of prior criminal offenses normalised to 0–1 scale.",
    "crime_severity_risk":  "Severity of the crime type on a predefined severity scale.",
    "weapon_risk":          "Whether a weapon was used in the current offense.",
    "gang_risk":            "Whether the offense is gang-related.",
    "district_risk":        "Historical crime rate and recidivism rate in the offender's district.",
    "age_risk":             "Age-related risk factor (young adults 18–30 carry highest risk).",
    "recidivism_risk":      "Whether the offender has a documented history of re-offending.",
    "gender_risk":          "Statistical risk differential based on offender gender.",
}


def explain_risk(case_id: str) -> dict:
    """Return a detailed, human-readable explanation for a scored case."""
    case = get_scored_case(case_id)
    if not case:
        return {"error": f"Case '{case_id}' not found. Score the offender first via POST /risk/score."}

    features = case["feature_scores"]
    risk_score = case["risk_score"]

    # Contribution = feature_value * weight * 100 (portion of the 0-100 score)
    contributions = []
    for feat, weight in FEATURE_WEIGHTS.items():
        raw_val = features.get(feat, 0.0)
        contribution = round(raw_val * weight * 100, 2)
        contributions.append({
            "feature": feat,
            "label": FEATURE_LABELS.get(feat, feat),
            "description": FEATURE_DESCRIPTIONS.get(feat, ""),
            "raw_value": raw_val,
            "weight": weight,
            "contribution_to_score": contribution,
            "contribution_pct": round((contribution / risk_score * 100) if risk_score > 0 else 0, 2),
        })

    # Sort by contribution descending
    contributions.sort(key=lambda x: x["contribution_to_score"], reverse=True)

    top_drivers = [c["label"] for c in contributions[:3]]

    explanation_text = (
        f"This offender received a risk score of {risk_score}/100 ({case['risk_level']} risk). "
        f"The top contributing factors are: {', '.join(top_drivers)}. "
        f"{case['recommendation']}"
    )

    return {
        "case_id": case_id,
        "risk_score": risk_score,
        "risk_level": case["risk_level"],
        "explanation": explanation_text,
        "feature_contributions": contributions,
        "top_risk_drivers": top_drivers,
        "input_profile": case["input_profile"],
        "recommendation": case["recommendation"],
        "timestamp": case["timestamp"],
    }
