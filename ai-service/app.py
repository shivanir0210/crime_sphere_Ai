"""
CrimeSphere AI — Analytics & Prediction Service
================================================
FastAPI entry point. Run with:

    uvicorn app:app --reload

Swagger UI: http://localhost:8000/docs
ReDoc:      http://localhost:8000/redoc
"""

from __future__ import annotations

from fastapi import FastAPI, HTTPException, Query, File, UploadFile
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
        print("[SUCCESS] Hotspot prediction model loaded.")
    except Exception as exc:
        print(f"[WARNING] Model load error: {exc}. Will train on first prediction request.")
    yield
    print("[SHUTDOWN] CrimeSphere AI shutting down.")


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


# ---------------------------------------------------------------------------
# Document Analysis Endpoint
# ---------------------------------------------------------------------------

import fitz # PyMuPDF
import docx
import io
import os
import re
import json
import google.generativeai as genai

def extract_pdf_text(file_bytes: bytes) -> str:
    text = ""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text()
    except Exception as e:
        print(f"Error extracting PDF: {e}")
    return text

def extract_docx_text(file_bytes: bytes) -> str:
    text = ""
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
    return text

def extract_txt_text(file_bytes: bytes) -> str:
    try:
        return file_bytes.decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"Error extracting TXT: {e}")
        return ""

def rule_based_crime_analysis(text: str) -> dict:
    text_lower = text.lower()
    
    crime_keywords = [
        "crime", "police", "arrest", "suspect", "victim", "theft", "stole", "steal", 
        "robbery", "fraud", "scam", "murder", "assault", "weapon", "incident", "fir", 
        "complaint", "accused", "offense", "homicide", "burglary", "cybercrime", 
        "hacker", "cheat", "forge", "attack", "illegal"
    ]
    
    is_crime = any(kw in text_lower for kw in crime_keywords)
    
    if not is_crime:
        summary = "Uploaded document does not contain clear crime-related information."
        if "certificate" in text_lower or "degree" in text_lower:
            summary = "Uploaded document appears to be an educational certificate or diploma."
        elif "invoice" in text_lower or "receipt" in text_lower or "bill" in text_lower:
            summary = "Uploaded document appears to be a financial receipt or invoice."
        elif "resume" in text_lower or "cv" in text_lower or "experience" in text_lower:
            summary = "Uploaded document appears to be a CV or professional resume."
            
        return {
            "documentType": "General Document",
            "crimeDetected": False,
            "message": "No crime-related content detected.",
            "summary": summary,
            "riskLevel": "None"
        }
        
    crime_type = "General Crime"
    if "cyber" in text_lower or "online" in text_lower or "phishing" in text_lower or "hacker" in text_lower or "bank fraud" in text_lower:
        crime_type = "Cyber Fraud"
    elif "theft" in text_lower or "stole" in text_lower or "stolen" in text_lower:
        crime_type = "Theft"
    elif "robbery" in text_lower or "heist" in text_lower:
        crime_type = "Robbery"
    elif "murder" in text_lower or "homicide" in text_lower or "killed" in text_lower:
        crime_type = "Homicide"
    elif "assault" in text_lower or "beat" in text_lower or "attack" in text_lower:
        crime_type = "Assault"
    elif "burglary" in text_lower or "break-in" in text_lower:
        crime_type = "Burglary"
        
    victims = 0
    victim_match = re.search(r"victims?\s*:?\s*(\d+)", text_lower)
    if victim_match:
        victims = int(victim_match.group(1))
    else:
        victim_mentions = len(re.findall(r"\bvictim\b", text_lower))
        if victim_mentions > 0:
            victims = min(victim_mentions, 5)
        else:
            victims = 1
            
    suspects = 0
    suspect_match = re.search(r"suspects?\s*:?\s*(\d+)", text_lower)
    if suspect_match:
        suspects = int(suspect_match.group(1))
    else:
        suspect_mentions = len(re.findall(r"\bsuspect\b|\baccused\b", text_lower))
        if suspect_mentions > 0:
            suspects = min(suspect_mentions, 3)
        else:
            suspects = 1
            
    locations = []
    common_cities = ["bengaluru", "bangalore", "mysuru", "mysore", "mumbai", "delhi", "chennai", "kolkata", "hyderabad", "pune", "kochi", "downtown", "south"]
    for city in common_cities:
        if re.search(rf"\b{city}\b", text_lower):
            locations.append(city.capitalize() if city != "bangalore" else "Bengaluru")
    if not locations:
        locations = ["Bengaluru"]
        
    risk_level = "Medium"
    has_weapons = any(w in text_lower for w in ["gun", "knife", "pistol", "weapon", "armed", "dagger", "sword"])
    has_gangs = any(g in text_lower for g in ["gang", "syndicate", "network", "cartel", "group of"])
    has_violence = any(v in text_lower for v in ["killed", "murdered", "assaulted", "injur", "blood", "stab"])
    
    if has_violence or (has_weapons and has_gangs):
        risk_level = "Critical"
    elif has_weapons or has_gangs:
        risk_level = "High"
    elif "theft" in text_lower or "fraud" in text_lower:
        risk_level = "Medium"
    else:
        risk_level = "Low"
        
    recommendations = []
    if crime_type == "Cyber Fraud":
        recommendations = [
            "Freeze linked bank accounts and transaction gateways",
            "Collect IP logs and ISP session registry details",
            "Identify linked phone numbers and device MAC addresses"
        ]
    elif crime_type == "Theft" or crime_type == "Burglary":
        recommendations = [
            "Check local neighborhood CCTV footage feeds",
            "Conduct forensic lifting of latent fingerprints",
            "Interview eyewitnesses and active area patrols"
        ]
    elif crime_type == "Homicide" or crime_type == "Assault":
        recommendations = [
            "Secure the crime scene for forensic inspection",
            "Request immediate autopsy / medical report",
            "Locate and secure weapon of offense"
        ]
    else:
        recommendations = [
            "Deploy local intelligence and surveillance units",
            "Register formal FIR and assign case officer",
            "Establish suspect network link diagrams"
        ]
        
    summary = f"Incident report indicating occurrence of {crime_type} in {', '.join(locations)}. "
    if suspects > 0:
        summary += f"The report lists {suspects} suspect(s) and "
    summary += f"{victims} victim(s) affected."
    
    return {
        "documentType": "Crime Report",
        "crimeDetected": True,
        "crimeType": crime_type,
        "summary": summary,
        "riskLevel": risk_level,
        "victims": victims,
        "suspects": suspects,
        "locations": locations,
        "recommendations": recommendations,
        "confidence": 85
    }

def analyze_text_for_crime(text: str) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"""
            You are a Crime Analyst AI. Analyze the following document text and extract details.
            Respond ONLY with a valid JSON block containing the fields specified below.
            Do not include any markdown backticks (like ```json) or explanation outside the JSON. Just return the raw JSON string.

            If the text contains crime or incident report information:
            {{
                "documentType": "Crime Report",
                "crimeDetected": true,
                "crimeType": "<Type of crime, e.g. Cyber Fraud, Theft, Homicide, etc.>",
                "summary": "<A concise 1-2 sentence case summary of what happened>",
                "riskLevel": "<High, Medium, Low, or Critical based on weapon involvement, gang ties, recidivism, or severity>",
                "victims": <Integer number of victims mentioned, default 0>,
                "suspects": <Integer number of suspects mentioned, default 0>,
                "locations": ["<List of cities or locations mentioned>"],
                "recommendations": ["<List of recommended immediate investigator actions>"],
                "confidence": <Integer score 0-100 indicating extraction confidence>
            }}

            If the text does NOT contain any crime, incident, or illegal activity related information:
            {{
                "documentType": "General Document",
                "crimeDetected": false,
                "message": "No crime-related content detected.",
                "summary": "<1-2 sentence explanation of what the document appears to be, e.g., educational certificate, invoice, etc.>",
                "riskLevel": "None"
            }}

            Document text to analyze:
            \"\"\"{text}\"\"\"
            """
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            if response_text.startswith("```"):
                lines = response_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                response_text = "\n".join(lines).strip()
            
            analysis_dict = json.loads(response_text)
            if "crimeDetected" not in analysis_dict:
                analysis_dict["crimeDetected"] = (analysis_dict.get("documentType") == "Crime Report" or analysis_dict.get("crimeType") is not None)
            return analysis_dict
        except Exception as e:
            print(f"Gemini API analysis failed, falling back to rule-based: {e}")
            
    return rule_based_crime_analysis(text)

@app.post("/analyze-document", tags=["Document Analysis"], summary="Analyze uploaded document for crime information")
async def analyze_document_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        filename = file.filename or ""
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        
        if ext == "pdf":
            text = extract_pdf_text(content)
        elif ext in ("docx", "doc"):
            text = extract_docx_text(content)
        elif ext == "txt":
            text = extract_txt_text(content)
        else:
            return error_response("Unsupported file type. Please upload a PDF, DOCX, or TXT file.", code=400)
            
        if not text.strip():
            return error_response("The uploaded file is empty or contains no readable text.", code=400)
            
        result = analyze_text_for_crime(text)
        return success_response(result)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return error_response(f"Document analysis failed: {str(e)}", code=500)
