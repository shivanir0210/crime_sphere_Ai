import { queryCrimeData } from './crimeQueryEngine';
import { translateResponse } from './languageService';

const BASE_URL = 'http://127.0.0.1:8000';

/**
 * Helper to handle unavailable backend errors gracefully.
 */
const handleUnavailableBackend = (error) => {
  console.error("FastAPI Backend Error:", error);
  return {
    success: true,
    response: "CrimeSphere AI Service is currently unavailable.",
    englishResponse: "CrimeSphere AI Service is currently unavailable.",
    intelligenceData: null,
    englishIntelligenceData: null
  };
};

/**
 * Helper to dynamically translate the API responses into the active language
 * and return both localized and English original copies to support on-the-fly language updates.
 */
const translatePayload = async (engResponse, engIntel, language) => {
  const targetLang = language || 'en';
  if (targetLang === 'en') {
    return {
      success: true,
      response: engResponse,
      englishResponse: engResponse,
      intelligenceData: engIntel,
      englishIntelligenceData: engIntel
    };
  }

  const translatedResponse = await translateResponse(engResponse, targetLang);
  let translatedIntel = null;

  if (engIntel) {
    const translatedSummary = await translateResponse(engIntel.summary, targetLang);
    const translatedReasoning = await Promise.all(
      (engIntel.reasoning || []).map((r) => translateResponse(r, targetLang))
    );
    const translatedRecommendations = await Promise.all(
      (engIntel.recommendations || []).map((r) => translateResponse(r, targetLang))
    );
    const translatedHotspots = await Promise.all(
      (engIntel.hotspots || []).map(async (h) => ({
        ...h,
        location: await translateResponse(h.location, targetLang),
        risk: await translateResponse(h.risk, targetLang)
      }))
    );
    const translatedNetwork = await Promise.all(
      (engIntel.network || []).map(async (n) => ({
        ...n,
        from: await translateResponse(n.from, targetLang),
        relation: await translateResponse(n.relation, targetLang),
        to: await translateResponse(n.to, targetLang)
      }))
    );
    const translatedSimilarCases = await Promise.all(
      (engIntel.similarCases || []).map(async (c) => ({
        ...c,
        title: await translateResponse(c.title, targetLang)
      }))
    );

    translatedIntel = {
      ...engIntel,
      summary: translatedSummary,
      reasoning: translatedReasoning,
      recommendations: translatedRecommendations,
      hotspots: translatedHotspots,
      network: translatedNetwork,
      similarCases: translatedSimilarCases
    };
  }

  return {
    success: true,
    response: translatedResponse,
    englishResponse: engResponse,
    intelligenceData: translatedIntel,
    englishIntelligenceData: engIntel
  };
};

/**
 * Extracts hotspot params from user message or falls back to default.
 */
const extractHotspotParams = (message) => {
  const msgLower = message.toLowerCase();
  
  // Find decimal coordinates (latitude and longitude)
  const numbers = message.match(/[-+]?[0-9]*\.?[0-9]+/g);
  let latitude = 13.05;
  let longitude = 77.62;
  if (numbers && numbers.length >= 2) {
    latitude = parseFloat(numbers[0]);
    longitude = parseFloat(numbers[1]);
  }
  
  let time_of_day = "Night";
  if (msgLower.includes("day")) time_of_day = "Day";
  else if (msgLower.includes("night")) time_of_day = "Night";
  else if (msgLower.includes("evening")) time_of_day = "Evening";
  else if (msgLower.includes("morning")) time_of_day = "Morning";
  
  let season = "Winter";
  if (msgLower.includes("winter")) season = "Winter";
  else if (msgLower.includes("summer")) season = "Summer";
  else if (msgLower.includes("spring")) season = "Spring";
  else if (msgLower.includes("autumn") || msgLower.includes("fall")) season = "Autumn";
  else if (msgLower.includes("monsoon")) season = "Monsoon";
  
  let district = "Downtown";
  const districts = ["downtown", "south", "north", "east", "west", "central", "metro", "suburb", "highway"];
  for (const d of districts) {
    if (msgLower.includes(d)) {
      district = d.charAt(0).toUpperCase() + d.slice(1);
      break;
    }
  }
  
  return { latitude, longitude, time_of_day, season, district };
};

/**
 * Extracts risk scoring params from user message or falls back to default.
 */
const extractRiskParams = (message) => {
  const msgLower = message.toLowerCase();
  
  let offender_age = 24;
  const numbers = message.match(/\b\d+\b/g);
  if (numbers) {
    for (const num of numbers) {
      const val = parseInt(num, 10);
      if (val >= 10 && val <= 100) {
        offender_age = val;
        break;
      }
    }
  }
  
  let offender_gender = "Male";
  if (msgLower.includes("female")) offender_gender = "Female";
  
  let prior_offenses = 4;
  if (numbers && numbers.length > 1) {
    const val = parseInt(numbers[1], 10);
    if (val >= 0 && val < 50 && val !== offender_age) {
      prior_offenses = val;
    }
  }
  
  let weapon_used = msgLower.includes("weapon") || msgLower.includes("gun") || msgLower.includes("knife") || msgLower.includes("armed");
  if (!weapon_used && msgLower.includes("no weapon")) weapon_used = false;
  
  let gang_related = msgLower.includes("gang") || msgLower.includes("syndicate") || msgLower.includes("group");
  
  let crime_type = "Robbery";
  const types = ["robbery", "theft", "murder", "assault", "fraud", "cybercrime", "burglary", "homicide"];
  for (const t of types) {
    if (msgLower.includes(t)) {
      crime_type = t.charAt(0).toUpperCase() + t.slice(1);
      break;
    }
  }
  
  let district = "South";
  const districts = ["downtown", "south", "north", "east", "west", "central", "metro"];
  for (const d of districts) {
    if (msgLower.includes(d)) {
      district = d.charAt(0).toUpperCase() + d.slice(1);
      break;
    }
  }

  let recidivism_history = null;
  if (msgLower.includes("recidivism") || msgLower.includes("re-offend") || msgLower.includes("repeat") || msgLower.includes("prior record")) {
    recidivism_history = true;
  } else if (msgLower.includes("first time") || msgLower.includes("no prior record") || msgLower.includes("no recidivism")) {
    recidivism_history = false;
  }
  
  return {
    offender_age,
    offender_gender,
    prior_offenses,
    weapon_used,
    gang_related,
    crime_type,
    district,
    recidivism_history
  };
};

/**
 * Reusable backend API functions
 */

export const fetchAnalyticsSummary = async (language) => {
  try {
    const res = await fetch(`${BASE_URL}/analytics/summary`);
    if (!res.ok) throw new Error("HTTP error");
    const json = await res.json();
    if (json.status !== "success") throw new Error("API error");
    
    const data = json.data;
    const engResponse = `Crime Summary Report: Total cases analyzed is ${data.total_cases}. The most common crime type is ${data.top_crime_type}, and the most active district is ${data.top_district}. Average severity score is ${data.average_severity_score}, with an arrest rate of ${data.arrest_rate_pct}% and a recidivism rate of ${data.recidivism_rate_pct}%.`;
    
    const engIntel = {
      summary: `Summary of ${data.total_cases} analyzed crime cases. Top crime is ${data.top_crime_type}; top district is ${data.top_district}.`,
      riskScore: Math.round(data.average_severity_score * 10),
      reasoning: [
        `Arrest Rate: ${data.arrest_rate_pct}%`,
        `Weapon Involvement: ${data.weapon_involvement_pct}%`,
        `Gang Related: ${data.gang_related_pct}%`,
        `Recidivism Rate: ${data.recidivism_rate_pct}%`
      ],
      hotspots: Object.entries(data.district_distribution || {}).slice(0, 5).map(([k, v]) => ({
        location: k,
        risk: v > 250 ? "High" : "Medium"
      })),
      network: [
        { from: data.top_crime_type, relation: "Top Crime ↕", to: data.top_district }
      ],
      recommendations: [
        `Focus resources on top crime type: ${data.top_crime_type}.`,
        `Increase patrol presence in top district: ${data.top_district}.`
      ],
      similarCases: [
        { id: "SUM-1", title: "Overall Summary Dataset" }
      ]
    };
    
    return await translatePayload(engResponse, engIntel, language);
  } catch (error) {
    return handleUnavailableBackend(error);
  }
};

export const fetchAnalyticsTrends = async (language) => {
  try {
    const res = await fetch(`${BASE_URL}/analytics/trends`);
    if (!res.ok) throw new Error("HTTP error");
    const json = await res.json();
    if (json.status !== "success") throw new Error("API error");
    
    const data = json.data;
    const trendSummaryText = (data.trend || []).slice(0, 5).map(t => `${t.period}: ${t.count}`).join(', ');
    const engResponse = `Crime Trends Report: Crime count trends grouped by ${data.group_by}. Sample trends: ${trendSummaryText}.`;
    
    const engIntel = {
      summary: `Crime count trends grouped by ${data.group_by}.`,
      riskScore: 60,
      reasoning: (data.crime_type_summary || []).slice(0, 6).map(c => `${c.crime_type}: ${c.total} cases (avg severity: ${c.avg_severity})`),
      hotspots: [],
      network: [],
      recommendations: [
        "Allocate dynamic patrols based on monthly peaks.",
        "Monitor seasonal fluctuations in crime counts."
      ],
      similarCases: []
    };
    
    return await translatePayload(engResponse, engIntel, language);
  } catch (error) {
    return handleUnavailableBackend(error);
  }
};

export const fetchAnalyticsAge = async (language) => {
  try {
    const res = await fetch(`${BASE_URL}/analytics/age`);
    if (!res.ok) throw new Error("HTTP error");
    const json = await res.json();
    if (json.status !== "success") throw new Error("API error");
    
    const data = json.data;
    const stats = data.statistics;
    const engResponse = `Age-based Crime Analysis: Offender age ranges from ${stats.offender.min_age} to ${stats.offender.max_age} (mean: ${stats.offender.mean_age}, median: ${stats.offender.median_age}). Victim age ranges from ${stats.victim.min_age} to ${stats.victim.max_age} (mean: ${stats.victim.mean_age}).`;
    
    const engIntel = {
      summary: "Age distribution profile of offenders and victims.",
      riskScore: 50,
      reasoning: [
        `Offender Mean Age: ${stats.offender.mean_age}`,
        `Victim Mean Age: ${stats.victim.mean_age}`,
        `Highest offender count in group: ${Object.keys(data.offender_age_distribution)[0] || '18-24'}`
      ],
      hotspots: [],
      network: [],
      recommendations: [
        "Deploy youth diversion and community counseling programs.",
        "Audit senior citizen safety watch schemes."
      ],
      similarCases: []
    };
    
    return await translatePayload(engResponse, engIntel, language);
  } catch (error) {
    return handleUnavailableBackend(error);
  }
};

export const fetchAnalyticsGender = async (language) => {
  try {
    const res = await fetch(`${BASE_URL}/analytics/gender`);
    if (!res.ok) throw new Error("HTTP error");
    const json = await res.json();
    if (json.status !== "success") throw new Error("API error");
    
    const data = json.data;
    const malePct = data.offender_gender_percentages.Male || 0;
    const femalePct = data.offender_gender_percentages.Female || 0;
    
    const engResponse = `Gender-based Crime Analysis: Offender breakdown is ${malePct}% Male and ${femalePct}% Female. Severity analysis shows differences in crime types across genders.`;
    
    const engIntel = {
      summary: "Offender and victim gender distribution breakdowns.",
      riskScore: 45,
      reasoning: [
        `Male Offenders: ${malePct}%`,
        `Female Offenders: ${femalePct}%`,
        `Arrest rate for male offenders: ${data.arrest_rate_by_offender_gender.find(g => g.gender === 'Male')?.arrest_rate_pct || 0}%`
      ],
      hotspots: [],
      network: [],
      recommendations: [
        "Review gender-responsive correctional programs.",
        "Optimize support services for gender-specific victim demographics."
      ],
      similarCases: []
    };
    
    return await translatePayload(engResponse, engIntel, language);
  } catch (error) {
    return handleUnavailableBackend(error);
  }
};

export const fetchAnalyticsDistrict = async (language) => {
  try {
    const res = await fetch(`${BASE_URL}/analytics/district`);
    if (!res.ok) throw new Error("HTTP error");
    const json = await res.json();
    if (json.status !== "success") throw new Error("API error");
    
    const data = json.data;
    const topDist = data.district_summary[0];
    const engResponse = `District Crime Analysis: Total cases in scope is ${data.total_cases_in_scope}. The most active district is ${topDist.district} with ${topDist.total_crimes} crimes and an arrest rate of ${topDist.arrest_rate_pct}%.`;
    
    const engIntel = {
      summary: "District-level density, severity, and arrest rate index.",
      riskScore: 70,
      reasoning: (data.district_summary || []).slice(0, 5).map(d => `${d.district}: ${d.total_crimes} cases (avg severity: ${d.avg_severity})`),
      hotspots: (data.district_hotspot_coordinates || []).slice(0, 5).map(h => ({
        location: h.district,
        risk: h.incidents > 200 ? "High" : "Medium"
      })),
      network: [],
      recommendations: [
        `Deploy tactical units to high-density district: ${topDist.district}.`,
        "Optimize response times across suburban boundary precincts."
      ],
      similarCases: []
    };
    
    return await translatePayload(engResponse, engIntel, language);
  } catch (error) {
    return handleUnavailableBackend(error);
  }
};

export const fetchHotspotPrediction = async (message, language) => {
  try {
    const params = extractHotspotParams(message);
    const res = await fetch(`${BASE_URL}/predict/hotspot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("HTTP error");
    const json = await res.json();
    if (json.status !== "success") throw new Error("API error");
    
    const data = json.data;
    const isHotspotText = data.is_hotspot ? "CRIME HOTSPOT" : "not a crime hotspot";
    const engResponse = `Hotspot Prediction Result: The location (${data.input.latitude}, ${data.input.longitude}) in ${data.input.district} during ${data.input.time_of_day} (${data.input.season}) is predicted to be ${isHotspotText} (Confidence Probability: ${(data.hotspot_probability * 100).toFixed(1)}%, Risk Level: ${data.risk_level}).`;
    
    const engIntel = {
      summary: `AI Hotspot Prediction analysis using Random Forest model. input location: ${data.input.district}.`,
      riskScore: Math.round(data.hotspot_probability * 100),
      reasoning: Object.entries(data.model_feature_importances || {}).map(([k, v]) => `Feature Importance (${k}): ${(v * 100).toFixed(1)}%`),
      hotspots: [
        { location: `${data.input.district} (${data.input.latitude}, ${data.input.longitude})`, risk: data.risk_level }
      ],
      network: [],
      recommendations: [
        data.is_hotspot ? "Dispatch immediate tactical patrols to coordinates." : "Maintain normal monitoring patrols.",
        "Audit check-posts around district perimeter."
      ],
      similarCases: []
    };
    
    return await translatePayload(engResponse, engIntel, language);
  } catch (error) {
    return handleUnavailableBackend(error);
  }
};

export const fetchRiskScore = async (message, language) => {
  try {
    const params = extractRiskParams(message);
    const res = await fetch(`${BASE_URL}/risk/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("HTTP error");
    const json = await res.json();
    if (json.status !== "success") throw new Error("API error");
    
    const data = json.data;
    const engResponse = `Risk Score computed for case #${data.case_id}: Composite offender risk score is ${data.risk_score}/100, which qualifies as ${data.risk_level} risk. Recommendation: ${data.recommendation}. Query 'explain risk ${data.case_id}' to view the feature contribution breakdown.`;
    
    const engIntel = {
      summary: `AI Offender Risk Assessment computed for case #${data.case_id}.`,
      riskScore: data.risk_score,
      reasoning: Object.entries(data.feature_scores || {}).map(([k, v]) => `${k.replace('_risk', '').replace('_', ' ')}: ${(v * 100).toFixed(1)}%`),
      hotspots: [
        { location: `${data.input_profile.district} District`, risk: data.risk_level }
      ],
      network: [
        { from: data.input_profile.crime_type, relation: "Prior Offenses ↕", to: String(data.input_profile.prior_offenses) }
      ],
      recommendations: [
        data.recommendation,
        "Assess history of recidivism.",
        "Monitor suspect's movements in high-risk zones."
      ],
      similarCases: []
    };
    
    return await translatePayload(engResponse, engIntel, language);
  } catch (error) {
    return handleUnavailableBackend(error);
  }
};

export const fetchRiskExplain = async (caseId, language) => {
  try {
    if (!caseId) {
      const engResponse = "Please specify a valid 8-character Case ID. E.g. 'explain risk A1B2C3D4'";
      return await translatePayload(engResponse, null, language);
    }
    
    const res = await fetch(`${BASE_URL}/risk/explain/${caseId}`);
    if (!res.ok) {
      if (res.status === 404) {
        const engResponse = `Case ID #${caseId} not found in the active session. Please score the offender first via a 'risk' query.`;
        return await translatePayload(engResponse, null, language);
      }
      throw new Error("HTTP error");
    }
    const json = await res.json();
    if (json.status !== "success") throw new Error("API error");
    
    const data = json.data;
    const engResponse = `Risk Score Explanation for Case #${data.case_id}: ${data.explanation} Top Risk Drivers: ${data.top_risk_drivers.join(', ')}.`;
    
    const engIntel = {
      summary: data.explanation,
      riskScore: data.risk_score,
      reasoning: (data.feature_contributions || []).map(c => `${c.label}: +${c.contribution_to_score} points (${c.contribution_pct}%) - ${c.description}`),
      hotspots: [],
      network: [],
      recommendations: [
        data.recommendation || "Maintain standard case monitoring."
      ],
      similarCases: []
    };
    
    return await translatePayload(engResponse, engIntel, language);
  } catch (error) {
    return handleUnavailableBackend(error);
  }
};

/**
 * Stateful API Service Entry Point.
 * Routes matching queries to FastAPI backend, and falls back to mock Gemini engine.
 */
export const sendMessage = async (message, context = {}, language = 'en') => {
  // Simulate network latency (400ms) to display typing indicator
  await new Promise((resolve) => setTimeout(resolve, 400));

  const msgLower = message.toLowerCase();

  // Route to backend if keywords match
  if (msgLower.includes("explain risk")) {
    const match = message.toUpperCase().match(/EXPLAIN RISK\s+([A-Z0-9]+)/);
    const caseId = match ? match[1] : "";
    return fetchRiskExplain(caseId, language);
  } else if (msgLower.includes("summary")) {
    return fetchAnalyticsSummary(language);
  } else if (msgLower.includes("trend")) {
    return fetchAnalyticsTrends(language);
  } else if (msgLower.includes("age")) {
    return fetchAnalyticsAge(language);
  } else if (msgLower.includes("gender")) {
    return fetchAnalyticsGender(language);
  } else if (msgLower.includes("district")) {
    return fetchAnalyticsDistrict(language);
  } else if (msgLower.includes("hotspot")) {
    return fetchHotspotPrediction(message, language);
  } else if (msgLower.includes("risk")) {
    return fetchRiskScore(message, language);
  } else {
    // Fallback to existing chatbot/Gemini response (crimeQueryEngine)
    return queryCrimeData(message, context, language);
  }
};

/**
 * Sends an uploaded file (PDF, DOCX, TXT) to the FastAPI backend for real document analysis.
 * Translates the extracted crime insights to the user's selected language.
 */
export const analyzeDocument = async (file, language = 'en') => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/analyze-document`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }

    const json = await res.json();
    if (json.status !== 'success') {
      throw new Error(json.message || "API error");
    }

    const data = json.data;
    
    // Check if crimeDetected is false
    if (data.crimeDetected === false) {
      const targetLang = language || 'en';
      const responseText = data.message || "No crime-related content detected.";
      const summaryText = data.summary || "No crime detected.";
      
      const translatedMsg = await translateResponse(responseText, targetLang);
      const translatedSummary = await translateResponse(summaryText, targetLang);
      
      return {
        success: true,
        crimeDetected: false,
        response: translatedMsg,
        englishResponse: responseText,
        data: {
          ...data,
          message: translatedMsg,
          summary: translatedSummary
        }
      };
    }

    // It is a crime report!
    const engResponse = `Document Analysis completed successfully. Document Type: ${data.documentType || 'Crime Report'}. Detected Crime: ${data.crimeType || 'General Crime'}. Risk level assessed as ${data.riskLevel || 'Medium'} (Confidence: ${data.confidence || 85}%). Locations: ${data.locations ? data.locations.join(', ') : 'Bengaluru'}.`;
    
    const engIntel = {
      summary: data.summary || 'Summary of the uploaded crime document.',
      riskScore: data.riskLevel === 'Critical' ? 95 : data.riskLevel === 'High' ? 85 : data.riskLevel === 'Medium' ? 55 : 25,
      reasoning: [
        `Document Type: ${data.documentType}`,
        `Crime Category: ${data.crimeType}`,
        `Suspects Identified: ${data.suspects || 0}`,
        `Victims Affected: ${data.victims || 0}`,
        `Confidence Level: ${data.confidence || 85}%`
      ],
      hotspots: (data.locations || []).map(loc => ({
        location: loc,
        risk: data.riskLevel || 'Medium'
      })),
      network: [
        { from: data.crimeType || 'Crime', relation: 'Associated Suspects', to: String(data.suspects || 0) }
      ],
      recommendations: data.recommendations || [
        "Review details for suspect link extraction.",
        "Initiate background intelligence sweeps on named locations."
      ],
      similarCases: [
        { id: `DOC-${Math.round(Math.random() * 1000)}`, title: `Incident Report: ${data.crimeType || 'General'}` }
      ]
    };
    
    const targetLang = language || 'en';
    const payload = await translatePayload(engResponse, engIntel, targetLang);
    return {
      success: true,
      crimeDetected: true,
      response: payload.response,
      englishResponse: payload.englishResponse,
      intelligenceData: payload.intelligenceData,
      englishIntelligenceData: payload.englishIntelligenceData,
      rawAnalysis: data
    };
  } catch (error) {
    console.error("Document Upload Analysis Error:", error);
    return {
      success: false,
      error: error.message || "Unknown error"
    };
  }
};
