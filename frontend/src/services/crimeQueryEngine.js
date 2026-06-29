import { translateResponse } from './languageService';

/**
 * Smart Crime Query Engine for CrimeSphere AI.
 * Uses keyword intelligence to match search patterns and query active datasets,
 * returning structured reports with summaries, risk scores, recommendations,
 * timelines, related cases, and hotspots.
 * 
 * Update: Now runs asynchronously and dynamically translates all mock data fields.
 */
export const queryCrimeData = async (message, context = {}, language = 'en') => {
  const query = message.toLowerCase();
  
  // Extract context parameters
  const ctxCrime = (context.crimeType || '').toLowerCase();
  const ctxLoc = (context.location || '').toLowerCase();

  let result = null;

  // Pattern 1: Show repeat offenders in Bengaluru
  if (
    (query.includes('repeat offender') && (query.includes('bengaluru') || query.includes('bangalore'))) ||
    (ctxCrime.includes('repeat offender') && ctxLoc.includes('bengaluru')) ||
    (query.includes('only in bengaluru') && ctxCrime.includes('repeat offender'))
  ) {
    result = {
      success: true,
      response: "Found 2 repeat offenders active in Bengaluru: Kiran Kumar and Rajesh Sekhar.",
      intelligenceData: {
        summary: "Filtered 2 repeat offenders linked to Bengaluru Majestic transit logs and local precincts.",
        riskScore: 85,
        reasoning: [
          "Linked to 4 Bengaluru Majestic FIR files",
          "Appeared in Bengaluru hotspot zones (Majestic, KR Market)",
          "Observed coordinates correlation"
        ],
        hotspots: [
          { location: "Bengaluru Majestic", risk: "High" },
          { location: "KR Market Hub", risk: "High" }
        ],
        network: [
          { from: "Kiran Kumar", relation: "Co-accused ↕", to: "Rajesh Sekhar" }
        ],
        recommendations: [
          "Audit Majestic transit logs",
          "Establish night watch at Majestic Bus Stand"
        ],
        similarCases: [
          { id: "101", title: "KR Market Theft Case #809" }
        ]
      }
    };
  }

  // Pattern 2: Find suspects connected to cyber fraud
  else if (
    (query.includes('suspect') && (query.includes('cyber') || query.includes('fraud'))) ||
    (ctxCrime.includes('cyber') && query.includes('suspect'))
  ) {
    result = {
      success: true,
      response: "Found 3 suspects connected to cyber fraud ring.",
      intelligenceData: {
        summary: "Suspect network analysis shows coordination on UPI spoofing and mule bank accounts.",
        riskScore: 90,
        reasoning: [
          "Direct call log matches to offshore hosts",
          "Wired funds to mule networks",
          "IP matches on spoof admin accounts"
        ],
        hotspots: [
          { location: "Electronic City Tech Zone", risk: "High" },
          { location: "Whitefield Hub", risk: "Medium" }
        ],
        network: [
          { from: "Suspect C (Phisher)", relation: "Wire Transfer ↕", to: "Mule Account Group" },
          { from: "Suspect C (Phisher)", relation: "Call Log ↕", to: "Offshore Node X" }
        ],
        recommendations: [
          "Freeze mule bank accounts",
          "Subpoena gateway communication logs"
        ],
        similarCases: [
          { id: "201", title: "UPI Phishing Scam #101" },
          { id: "202", title: "Bank Spoofing Investigation #202" }
        ]
      }
    };
  }

  // Pattern 3: Show cybercrime cases
  else if (query.includes('cybercrime') || query.includes('cyber') || ctxCrime.includes('cybercrime')) {
    result = {
      success: true,
      response: "Cybercrime complaints increased by 18% this month, primarily UPI phishing.",
      intelligenceData: {
        summary: "Cybercrime complaints increased by 18% this month, primarily UPI phishing and credentials harvesting.",
        riskScore: 78,
        reasoning: [
          "Spike in credential phishing URLs detected",
          "Proxy servers traced to foreign domains",
          "UPI spoof applications identified"
        ],
        hotspots: [
          { location: "Electronic City", risk: "High" },
          { location: "Whitefield Hub", risk: "Medium" }
        ],
        network: [
          { from: "UPI Spoof Server", relation: "Hosted Domain ↕", to: "Suspect C" },
          { from: "Suspect C", relation: "Recruiter ↕", to: "Mule Account Group" }
        ],
        recommendations: [
          "Subpoena server host logs",
          "Notify banking UPI gateways",
          "Request DNS takedown of phishing domain"
        ],
        similarCases: [
          { id: "201", title: "UPI Phishing Scam #101" },
          { id: "202", title: "Bank Spoofing Investigation #202" },
          { id: "305", title: "UPI Scam #305" }
        ]
      }
    };
  }

  // Pattern 4: Show financial fraud suspects
  else if (
    (query.includes('financial') || query.includes('fraud')) && query.includes('suspect')
  ) {
    result = {
      success: true,
      response: "Suspicious transactions identified across 5 accounts linked to suspect nodes.",
      intelligenceData: {
        summary: "Suspicious transactions identified across 5 bank accounts representing layered shell entities.",
        riskScore: 88,
        reasoning: [
          "Rapid transit of funds across shell entities",
          "Amounts structured below reporting limits",
          "Linked to known financial fraud offenders"
        ],
        hotspots: [
          { location: "Central Business District", risk: "High" },
          { location: "Offshore Node Traces", risk: "High" }
        ],
        network: [
          { from: "Sender Account", relation: "Wire Transfer ↕", to: "Mule Account A" },
          { from: "Mule Account A", relation: "ATM Cashout ↕", to: "Suspect Node X" }
        ],
        recommendations: [
          "Notify Financial Intelligence Unit",
          "Freeze beneficiary accounts"
        ],
        similarCases: [
          { id: "302", title: "Layering Scheme #302" },
          { id: "909", title: "Mule Network Investigation #909" }
        ]
      }
    };
  }

  // Pattern 5: Show high risk offenders
  else if (query.includes('high risk') || query.includes('risk offenders')) {
    result = {
      success: true,
      response: "Detected active burglary syndicate with elevated risk score.",
      intelligenceData: {
        summary: "Burglary and fencing syndicate active on city borders with a high-risk score of 95/100.",
        riskScore: 95,
        reasoning: [
          "Direct links between 7 co-conspirators",
          "Shared communications logs during crimes",
          "Fencing operations located on city perimeter"
        ],
        hotspots: [
          { location: "Bengaluru Outer Ring", risk: "High" },
          { location: "Mysuru Highway", risk: "Medium" }
        ],
        network: [
          { from: "Suspect A", relation: "Call Log ↕", to: "Suspect B" },
          { from: "Suspect B", relation: "Asset Dump ↕", to: "Suspect C" }
        ],
        recommendations: [
          "Execute simultaneous warrants",
          "Block asset sales channels"
        ],
        similarCases: [
          { id: "310", title: "Burglary Syndicate Ring #110" }
        ]
      }
    };
  }

  // Pattern 6: Find linked cases
  else if (query.includes('linked cases') || query.includes('find linked')) {
    result = {
      success: true,
      response: "Identified cross-jurisdictional links between 3 active theft investigations.",
      intelligenceData: {
        summary: "Cross-jurisdictional correlation shows same modus operandi across Majestic and Mysuru cases.",
        riskScore: 75,
        reasoning: [
          "Similar lock-breaking tools used",
          "Offender coordinates match transit logs",
          "Related fence networks observed"
        ],
        hotspots: [
          { location: "Bengaluru Majestic", risk: "High" },
          { location: "Mysuru Junction", risk: "Medium" }
        ],
        network: [
          { from: "Kiran Kumar", relation: "Co-accused ↕", to: "Rajesh Sekhar" },
          { from: "Rajesh Sekhar", relation: "Associate ↕", to: "Amit R. Gowda" }
        ],
        recommendations: [
          "Audit shared fencing accounts",
          "Coordinate across precinct teams"
        ],
        similarCases: [
          { id: "101", title: "KR Market Theft Case #809" },
          { id: "102", title: "Mysuru Handbag Snatching #402" }
        ]
      }
    };
  }

  // Fallback / Unknown queries
  else {
    result = {
      success: true,
      response: "Analyzing available crime intelligence data.",
      intelligenceData: {
        summary: "Analyzing available crime intelligence data in databases. No active alert thresholds triggered.",
        riskScore: 35,
        reasoning: [
          "No prior conviction match identified",
          "Current location outside identified hotspot areas",
          "No direct links to active suspects found"
        ],
        hotspots: [
          { location: "Hubli Junction", risk: "Low" }
        ],
        network: [
          { from: "Unknown Node", relation: "Indirect Link ↕", to: "Query Subject" }
        ],
        recommendations: [
          "Monitor local precinct registries",
          "Verify identification documents"
        ],
        similarCases: [
          { id: "404", title: "General Investigation #404" }
        ]
      }
    };
  }

  if (!result) return null;

  // Perform dynamic translations if language is not English
  const targetLang = language || 'en';
  if (targetLang === 'en') {
    return {
      ...result,
      englishResponse: result.response,
      englishIntelligenceData: result.intelligenceData
    };
  }

  const translatedResponse = await translateResponse(result.response, targetLang);
  let translatedIntel = null;

  if (result.intelligenceData) {
    const intel = result.intelligenceData;
    const translatedSummary = await translateResponse(intel.summary, targetLang);
    const translatedReasoning = await Promise.all(
      (intel.reasoning || []).map((r) => translateResponse(r, targetLang))
    );
    const translatedRecommendations = await Promise.all(
      (intel.recommendations || []).map((r) => translateResponse(r, targetLang))
    );
    const translatedHotspots = await Promise.all(
      (intel.hotspots || []).map(async (h) => ({
        ...h,
        location: await translateResponse(h.location, targetLang),
        risk: await translateResponse(h.risk, targetLang)
      }))
    );
    const translatedNetwork = await Promise.all(
      (intel.network || []).map(async (n) => ({
        ...n,
        from: await translateResponse(n.from, targetLang),
        relation: await translateResponse(n.relation, targetLang),
        to: await translateResponse(n.to, targetLang)
      }))
    );
    const translatedSimilarCases = await Promise.all(
      (intel.similarCases || []).map(async (c) => ({
        ...c,
        title: await translateResponse(c.title, targetLang)
      }))
    );

    translatedIntel = {
      ...intel,
      summary: translatedSummary,
      reasoning: translatedReasoning,
      recommendations: translatedRecommendations,
      hotspots: translatedHotspots,
      network: translatedNetwork,
      similarCases: translatedSimilarCases
    };
  }

  return {
    ...result,
    response: translatedResponse,
    englishResponse: result.response,
    intelligenceData: translatedIntel,
    englishIntelligenceData: result.intelligenceData
  };
};
