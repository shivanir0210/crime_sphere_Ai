/**
 * Context Manager Service for CrimeSphere AI.
 * Handles extracting crime types, locations, suspects, and case numbers
 * from user messages, and synchronizes active context with localStorage.
 */

const CONTEXT_KEY = 'crimesphere_investigation_context';

export const getStoredContext = () => {
  try {
    const saved = localStorage.getItem(CONTEXT_KEY);
    return saved ? JSON.parse(saved) : { crimeType: '', location: '', suspect: '', caseNumber: '' };
  } catch (e) {
    console.error('Error loading stored context:', e);
    return { crimeType: '', location: '', suspect: '', caseNumber: '' };
  }
};

export const storeContext = (context) => {
  try {
    localStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
  } catch (e) {
    console.error('Error storing context:', e);
  }
};

export const clearStoredContext = () => {
  try {
    localStorage.removeItem(CONTEXT_KEY);
  } catch (e) {
    console.error('Error clearing stored context:', e);
  }
  return { crimeType: '', location: '', suspect: '', caseNumber: '' };
};

export const extractContext = (text, currentContext = {}) => {
  const query = text.toLowerCase();
  const newContext = { ...currentContext };

  // Detect Crime Type
  if (query.includes('repeat offender')) {
    newContext.crimeType = 'Repeat Offender';
  } else if (query.includes('hotspot')) {
    newContext.crimeType = 'Crime Hotspot';
  } else if (query.includes('cyber') || query.includes('phishing')) {
    newContext.crimeType = 'Cybercrime';
  } else if (query.includes('network') || query.includes('connections')) {
    newContext.crimeType = 'Criminal Network';
  } else if (query.includes('fraud') || query.includes('financial')) {
    newContext.crimeType = 'Financial Fraud';
  } else if (query.includes('theft') || query.includes('burglary') || query.includes('robbery') || query.includes('fir')) {
    newContext.crimeType = 'Theft';
  }

  // Detect Location
  if (query.includes('bengaluru') || query.includes('bangalore')) {
    newContext.location = 'Bengaluru';
  } else if (query.includes('mysuru') || query.includes('mysore')) {
    newContext.location = 'Mysuru';
  } else if (query.includes('electronic city')) {
    newContext.location = 'Electronic City';
  } else if (query.includes('whitefield')) {
    newContext.location = 'Whitefield';
  } else if (query.includes('mangaluru') || query.includes('mangalore')) {
    newContext.location = 'Mangaluru';
  } else if (query.includes('hyderabad')) {
    newContext.location = 'Hyderabad';
  }

  // Detect Suspects
  if (query.includes('kiran') || query.includes('kiran kumar')) {
    newContext.suspect = 'Kiran Kumar';
  } else if (query.includes('rajesh') || query.includes('rajesh sekhar')) {
    newContext.suspect = 'Rajesh Sekhar';
  } else if (query.includes('amit') || query.includes('amit r. gowda')) {
    newContext.suspect = 'Amit R. Gowda';
  }

  // Detect Case Reference/Number
  const caseMatch = text.match(/(?:case|fir|#)\s*([0-9a-zA-Z]+)/i);
  if (caseMatch) {
    newContext.caseNumber = `#${caseMatch[1]}`;
  }

  return newContext;
};
