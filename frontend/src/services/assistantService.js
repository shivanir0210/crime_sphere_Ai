import { translateResponse } from './languageService';

/**
 * AI Assistant Service for CrimeSphere AI.
 * Recommends dynamic follow-up actions to guide the investigator
 * based on the current context and type of intelligence data returned.
 * 
 * Update: Runs asynchronously and translates recommendations dynamically to the current language.
 */
export const getFollowUpSuggestions = async (queryText, intelligenceData, language = 'en') => {
  const query = (queryText || '').toLowerCase();
  const risk = intelligenceData ? intelligenceData.riskScore : 0;
  const summary = intelligenceData ? (intelligenceData.summary || '').toLowerCase() : '';

  let suggestions = [];

  // 1. Cybercrime & Phishing Context
  if (query.includes('cyber') || query.includes('phishing') || summary.includes('cyber') || summary.includes('phishing')) {
    suggestions = [
      '✓ Find suspects connected to cyber fraud',
      '✓ View crime locations',
      '✓ Freeze beneficiary accounts',
      '✓ Generate report'
    ];
  }

  // 2. Financial Fraud Context
  else if (query.includes('fraud') || query.includes('financial') || summary.includes('fraud') || summary.includes('financial')) {
    suggestions = [
      '✓ Freeze beneficiary accounts',
      '✓ Find suspects connected to cyber fraud',
      '✓ View related cases',
      '✓ Generate report'
    ];
  }

  // 3. Repeat Offenders Context
  else if (query.includes('offender') || summary.includes('offender')) {
    suggestions = [
      '✓ Show linked suspects',
      '✓ View crime locations',
      '✓ Check previous FIRs',
      '✓ Generate report'
    ];
  }

  // 4. Criminal Networks / Linked cases
  else if (query.includes('network') || query.includes('linked') || summary.includes('network') || summary.includes('linked')) {
    suggestions = [
      '✓ Show linked suspects',
      '✓ View related cases',
      '✓ Analyze risk score',
      '✓ Generate report'
    ];
  }

  // 5. High Risk Context
  else if (risk >= 85) {
    suggestions = [
      '✓ Analyze risk score',
      '✓ View crime locations',
      '✓ Show linked suspects',
      '✓ Generate report'
    ];
  }

  // Default Guidance Recommendations
  else {
    suggestions = [
      '✓ Show repeat offenders in Bengaluru',
      '✓ Show cybercrime cases',
      '✓ Show financial fraud suspects',
      '✓ Find linked cases'
    ];
  }

  if (language === 'en') {
    return suggestions;
  }

  // Translate all suggestions dynamically
  return Promise.all(
    suggestions.map((s) => translateResponse(s, language))
  );
};
