"""Shared helper utilities."""

from __future__ import annotations
from typing import Any


def safe_round(value: Any, decimals: int = 2) -> float:
    """Safely round a numeric value."""
    try:
        return round(float(value), decimals)
    except (TypeError, ValueError):
        return 0.0


def series_to_dict(series) -> dict:
    """Convert a pandas Series to a plain dict with rounded float values."""
    return {str(k): safe_round(v) for k, v in series.items()}


def success_response(data: Any, message: str = "OK") -> dict:
    """Standard success response envelope."""
    return {"status": "success", "message": message, "data": data}


def error_response(message: str, code: int = 400) -> dict:
    """Standard error response envelope."""
    return {"status": "error", "message": message, "code": code}


def percentage(part: float, total: float) -> float:
    """Return percentage rounded to 2 dp."""
    if total == 0:
        return 0.0
    return safe_round((part / total) * 100)
