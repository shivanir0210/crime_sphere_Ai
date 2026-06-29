"""Feature engineering for the risk-scoring engine."""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Optional


# Severity weights per crime type (higher = more severe)
CRIME_SEVERITY: dict[str, float] = {
    "Homicide": 10.0,
    "Kidnapping": 9.0,
    "Sexual Offense": 8.5,
    "Robbery": 7.0,
    "Assault": 6.5,
    "Drug Offense": 5.5,
    "Burglary": 5.0,
    "Fraud": 4.0,
    "Theft": 3.0,
    "Vandalism": 2.0,
}

# Historical recidivism rate proxy per district (0-1 scale)
DISTRICT_RISK: dict[str, float] = {
    "Downtown": 0.75,
    "South": 0.70,
    "West": 0.65,
    "North": 0.60,
    "East": 0.58,
    "Central": 0.55,
    "Northeast": 0.50,
    "Northwest": 0.48,
    "Southeast": 0.45,
    "Southwest": 0.42,
}


@dataclass
class OffenderProfile:
    offender_age: int
    offender_gender: str
    prior_offenses: int
    weapon_used: bool
    gang_related: bool
    crime_type: str
    district: str
    recidivism_history: Optional[bool] = None

    def to_feature_vector(self) -> dict[str, float]:
        """Convert profile to a numeric feature dict."""
        age_risk = _age_risk_score(self.offender_age)
        gender_risk = 1.0 if self.offender_gender == "Male" else 0.6
        prior_risk = min(self.prior_offenses / 10.0, 1.0)
        weapon_risk = 1.0 if self.weapon_used else 0.0
        gang_risk = 1.0 if self.gang_related else 0.0
        crime_risk = CRIME_SEVERITY.get(self.crime_type, 5.0) / 10.0
        district_risk = DISTRICT_RISK.get(self.district, 0.5)
        recid_risk = 1.0 if self.recidivism_history else 0.0

        return {
            "age_risk": round(age_risk, 4),
            "gender_risk": round(gender_risk, 4),
            "prior_offense_risk": round(prior_risk, 4),
            "weapon_risk": round(weapon_risk, 4),
            "gang_risk": round(gang_risk, 4),
            "crime_severity_risk": round(crime_risk, 4),
            "district_risk": round(district_risk, 4),
            "recidivism_risk": round(recid_risk, 4),
        }


def _age_risk_score(age: int) -> float:
    """Young adults (18-30) show highest risk in the dataset."""
    if age < 18:
        return 0.55
    elif age <= 24:
        return 1.0
    elif age <= 30:
        return 0.90
    elif age <= 40:
        return 0.70
    elif age <= 50:
        return 0.50
    else:
        return 0.30
