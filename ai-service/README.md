# CrimeSphere AI — Analytics & Prediction Service

An AI-powered crime analytics and prediction microservice built with FastAPI, scikit-learn, and Pandas.

---

## Features

- **Crime Analytics** — trends, hotspots, time-of-day breakdowns
- **Age Analysis** — offender and victim age distributions
- **Gender Analysis** — gender-wise crime breakdowns
- **District Analysis** — per-district crime statistics
- **Hotspot Prediction** — Random Forest model predicts crime probability for a given location/time
- **Offender Risk Scoring** — rule + ML hybrid risk engine with explainability
- **Explainable AI** — feature-level contribution scores for every risk decision
- **Swagger UI** — auto-generated interactive API docs at `/docs`

---

## Folder Structure

```
ai-service/
├── app.py                  # FastAPI entry point
├── requirements.txt
├── README.md
├── .gitignore
├── dataset/
│   └── crimes.csv          # Sample dataset (2000 records)
├── analytics/
│   ├── crime_analytics.py
│   ├── age_analysis.py
│   ├── gender_analysis.py
│   └── district_analysis.py
├── prediction/
│   ├── hotspot_prediction.py
│   └── model.pkl           # Auto-generated on first run
├── risk_scoring/
│   ├── feature_engineering.py
│   ├── risk_engine.py
│   └── explainability.py
├── utils/
│   ├── load_data.py
│   └── helpers.py
└── models/                 # Reserved for additional saved models
```

---

## Quick Start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the server

```bash
uvicorn app:app --reload
```

### 3. Open API docs

Navigate to [http://localhost:8000/docs](http://localhost:8000/docs)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/analytics/summary` | Overall crime summary |
| GET | `/analytics/trends` | Crime trends over time |
| GET | `/analytics/age` | Age analysis |
| GET | `/analytics/gender` | Gender analysis |
| GET | `/analytics/district` | District analysis |
| POST | `/predict/hotspot` | Predict crime hotspot |
| POST | `/risk/score` | Score offender risk |
| GET | `/risk/explain/{case_id}` | Explain a risk score |

---

## Sample Hotspot Prediction Request

```json
POST /predict/hotspot
{
  "latitude": 13.05,
  "longitude": 77.62,
  "time_of_day": "Night",
  "season": "Winter",
  "district": "Downtown"
}
```

## Sample Risk Score Request

```json
POST /risk/score
{
  "offender_age": 24,
  "offender_gender": "Male",
  "prior_offenses": 4,
  "weapon_used": true,
  "gang_related": false,
  "crime_type": "Robbery",
  "district": "South"
}
```

---

## Tech Stack

- **Python 3.11+**
- **FastAPI** — REST API framework
- **Pandas / NumPy** — data processing
- **scikit-learn** — Random Forest model
- **Joblib** — model persistence
- **Uvicorn** — ASGI server

---

## Notes

- The `prediction/model.pkl` is automatically trained and saved on first startup.
- The dataset `dataset/crimes.csv` contains 2000 synthetic records for demonstration.
- All endpoints return JSON responses with consistent structure.
