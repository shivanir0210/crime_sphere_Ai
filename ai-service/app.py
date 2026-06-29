"""
CrimeSphere AI — Analytics & Prediction Service
================================================
FastAPI entry point. Run with:

    uvicorn app:app --reload

Swagger UI: http://localhost:8000/docs
ReDoc:      http://localhost:8000/redoc
"""

from __future__ import annotations

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
from typing import Optional

from analytics.crime_analytics import get_summary, get_trends
from analytics.age_analysis import get_age_analysis
from analytics.gender_analysis import get_gender_analysis
from analytics.district_analysis import get_district_analysis
from prediction.hotspot_prediction import predict_hotspot, train_model, load_model
from risk_scoring.feature_engineering import OffenderProfile
from risk_scoring.risk_engine import compute_risk_score
from risk_scoring.explainability import explain_risk
from utils.helpers import success_response, error_response


# ---------------------------------------------------------------------------
# Pydantic request/response models
# ---------------------------------------------------------------------------

class HotspotRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, example=13.05)
    longitude: float = Field(..., ge=-180, le=180, example=77.62)
    time_of_day: str = Field(..., example="Night")
    season: str = Field(..., example="Winter")
    district: str = Field(..., example="Downtown")


class RiskScoreRequest(BaseModel):
    offender_age: int = Field(..., ge=10, le=100, example=24)
    offender_gender: str = Field(..., example="Male")
    prior_offenses: int = Field(..., ge=0, example=4)
    weapon_used: bool = Field(..., example=True)
    gang_related: bool = Field(..., example=False)
    crime_type: str = Field(..., example="Robbery")
    district: str = Field(..., example="South")
    recidivism_history: Optional[bool] = Field(None, example=True)


# ---------------------------------------------------------------------------
# Lifespan: pre-load model on startup
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load (or train) the prediction model at startup."""
    try:
        load_model()
        print("✅ Hotspot prediction model loaded.")
    except Exception as exc:
        print(f"⚠️  Model load error: {exc}. Will train on first prediction request.")
    yield
    print("🛑 CrimeSphere AI shutting down.")


# ---------------------------------------------------------------------------
# App initialisation
# ---------------------------------------------------------------------------

app = FastAPI(
    title="CrimeSphere AI",
    description=(
        "## AI-powered Crime Analytics & Prediction Service\n\n"
        "Provides crime trend analytics, offender risk scoring with explainability, "
        "and hotspot prediction using a Random Forest model.\n\n"
        "**Dataset:** 2000 synthetic crime records across 10 districts."
    ),
    version="1.0.0",
    contact={"name": "CrimeSphere Team", "email": "team@crimesphere.ai"},
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"], summary="Service health check")
def root():
    return {
        "service": "CrimeSphere AI",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"], summary="Detailed health check")
def health():
    return success_response({"status": "healthy", "model": "loaded"})


# ---------------------------------------------------------------------------
# Analytics endpoints
# ---------------------------------------------------------------------------

@app.get("/analytics/summary", tags=["Analytics"], summary="Overall crime summary statistics")
def analytics_summary():
    """
    Returns a high-level summary of all crime data including:
    - Total cases
    - Top crime type & district
    - Arrest / weapon / gang / recidivism rates
    - Distribution across crime types, districts, time of day, and seasons
    """
    try:
        data = get_summary()
        return success_response(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analytics/trends", tags=["Analytics"], summary="Crime trends over time")
def analytics_trends(
    group_by: str = Query(
        "month",
        enum=["month", "year", "season", "time_of_day"],
        description="Time grouping dimension",
    )
):
    """
    Returns crime count trends grouped by the specified time dimension,
    plus a per-crime-type summary (total & avg severity).
    """
    try:
        data = get_trends(group_by=group_by)
        return success_response(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analytics/age", tags=["Analytics"], summary="Age-based crime analysis")
def analytics_age():
    """
    Offender and victim age distributions, age-group vs crime type breakdown,
    recidivism rate by age group, and descriptive age statistics.
    """
    try:
        data = get_age_analysis()
        return success_response(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analytics/gender", tags=["Analytics"], summary="Gender-based crime analysis")
def analytics_gender():
    """
    Offender and victim gender breakdowns, crime type by gender,
    severity, recidivism, weapon use, and arrest rates by gender.
    """
    try:
        data = get_gender_analysis()
        return success_response(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analytics/district", tags=["Analytics"], summary="District-level crime analysis")
def analytics_district(
    district: Optional[str] = Query(None, description="Filter to a specific district name")
):
    """
    Per-district crime counts, severity, arrest rates, top crime types,
    time-of-day breakdown, and hotspot coordinates.
    Pass `?district=Downtown` to filter to one district.
    """
    try:
        data = get_district_analysis(district=district)
        return success_response(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# Prediction endpoints
# ---------------------------------------------------------------------------

@app.post("/predict/hotspot", tags=["Prediction"], summary="Predict crime hotspot")
def predict_hotspot_endpoint(request: HotspotRequest):
    """
    Predicts whether a given location and time combination is a crime hotspot.

    Returns:
    - `is_hotspot` — boolean prediction
    - `hotspot_probability` — model confidence (0–1)
    - `risk_level` — Low / Medium / High
    - `model_feature_importances` — Random Forest feature importance breakdown
    """
    try:
        result = predict_hotspot(
            latitude=request.latitude,
            longitude=request.longitude,
            time_of_day=request.time_of_day,
            season=request.season,
            district=request.district,
        )
        return success_response(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/train", tags=["Prediction"], summary="Retrain the hotspot model")
def retrain_model():
    """
    Retrain the Random Forest hotspot model from scratch using the current dataset.
    Returns accuracy and classification report.
    """
    try:
        result = train_model()
        return success_response(result, message="Model retrained successfully.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# Risk scoring endpoints
# ---------------------------------------------------------------------------

@app.post("/risk/score", tags=["Risk Scoring"], summary="Score offender risk")
def risk_score(request: RiskScoreRequest):
    """
    Computes a composite risk score (0–100) for an offender based on:
    - Prior offenses, crime severity, weapon/gang involvement
    - Age, gender, district risk, recidivism history

    Returns score, risk level (Low/Medium/High/Critical), feature breakdown, and a `case_id`
    you can pass to `GET /risk/explain/{case_id}` for a full explanation.
    """
    try:
        profile = OffenderProfile(
            offender_age=request.offender_age,
            offender_gender=request.offender_gender,
            prior_offenses=request.prior_offenses,
            weapon_used=request.weapon_used,
            gang_related=request.gang_related,
            crime_type=request.crime_type,
            district=request.district,
            recidivism_history=request.recidivism_history,
        )
        result = compute_risk_score(profile)
        return success_response(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/risk/explain/{case_id}", tags=["Risk Scoring"], summary="Explain a risk score")
def risk_explain(case_id: str):
    """
    Returns a detailed, human-readable explanation of the risk score for a given `case_id`.

    Includes:
    - Feature-level contributions (value × weight → score points)
    - Top 3 risk drivers
    - Plain-English explanation text
    - Recommendation

    **Note:** Cases are held in memory for the session. Score the offender first via `POST /risk/score`.
    """
    try:
        result = explain_risk(case_id.upper())
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return success_response(result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
