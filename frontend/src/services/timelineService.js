/**
 * Timeline Service.
 * Phase 3 - Dynamic case milestone lookups.
 */

import { translateResponse } from './languageService';

/**
 * Maps case titles to investigation types.
 */
export const getTimelineType = (title = '') => {
  const name = title.toLowerCase();
  if (name.includes('repeat offender')) return 'repeatOffender';
  if (name.includes('cyber') || name.includes('fraud')) return 'cyberFraud';
  if (name.includes('network') || name.includes('suspect')) return 'criminalNetwork';
  if (name.includes('hotspot')) return 'crimeHotspot';
  return 'unknown';
};

/**
 * Returns timeline milestone arrays.
 */
export const getTimeline = async (type, language = 'en') => {
  const timelines = {
    repeatOffender: [
      { date: 'Jan 5', title: 'FIR Registered', desc: 'Case recorded in precinct file.' },
      { date: 'Jan 7', title: 'Suspect Cross-referenced', desc: 'Identified offender records in database.' },
      { date: 'Jan 9', title: 'Prior Convictions Fetched', desc: 'Retrieved 3 historical arrest reports.' },
      { date: 'Jan 12', title: 'Watchlist Updated', desc: 'Placed suspect under active surveillance.' }
    ],
    cyberFraud: [
      { date: 'Feb 10', title: 'Credential Harvesting Alert', desc: 'Victim reported credential phishing site.' },
      { date: 'Feb 11', title: 'IP Addresses Decrypted', desc: 'Traced proxy originating headers.' },
      { date: 'Feb 13', title: 'Accounts Flagged', desc: 'Flagged 5 target transaction accounts.' },
      { date: 'Feb 15', title: 'Assets Frozen', desc: 'Secured court warrant to hold target assets.' }
    ],
    criminalNetwork: [
      { date: 'Mar 20', title: 'Syndicate Profile Created', desc: 'Linked suspect phone exchanges mapped.' },
      { date: 'Mar 22', title: 'Log Subpoenas Served', desc: 'Call data records subpoenaed for 7 nodes.' },
      { date: 'Mar 25', title: 'Syndicate Tree Plotted', desc: 'Linked suspect map registered in case file.' },
      { date: 'Mar 28', title: 'Warrants Issued', desc: 'Magistrate signed search and capture warrants.' }
    ],
    crimeHotspot: [
      { date: 'Apr 1', title: 'Clustered Rates Logged', desc: 'Incident rates tracked in Majestic Bus Stand.' },
      { date: 'Apr 3', title: 'Patrol Dispatch Alert', desc: 'Increased tactical sweeps dispatched to target areas.' },
      { date: 'Apr 5', title: 'Hotspots Model Updated', desc: 'Patrol map routes recalculated.' },
      { date: 'Apr 8', title: 'Crime Rates Reduced', desc: 'Local precinct reported 30% reduction in local thefts.' }
    ]
  };

  const list = timelines[type] || null;
  if (!list) return null;

  // Translate titles and descriptions dynamically
  return Promise.all(
    list.map(async (event) => ({
      ...event,
      title: await translateResponse(event.title, language),
      desc: event.desc ? await translateResponse(event.desc, language) : ''
    }))
  );
};
