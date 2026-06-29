

import { getTranslation } from '../services/languageService';

/**
 * CrimeStats Component.
 * Displays high-level analytics summary cards for cases, offenders, and hotspot coordinates.
 */
function CrimeStats({ stats, language = 'en' }) {
  // Fallbacks for mock data
  const data = stats || {
    totalCases: 42,
    repeatOffenders: 12,
    hotspotsCount: 8,
    highRiskCount: 5
  };

  const cards = [
    { title: getTranslation('totalCases', language), value: data.totalCases, color: 'var(--text-color)' },
    { title: getTranslation('repeatOffendersTitle', language), value: data.repeatOffenders, color: 'var(--accent-color)' },
    { title: getTranslation('activeHotspots', language), value: data.hotspotsCount, color: 'var(--warning-color)' },
    { title: getTranslation('highRiskSuspects', language), value: data.highRiskCount, color: 'var(--danger-color)' }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        width: '100%'
      }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="card"
          style={{
            padding: '16px 12px',
            backgroundColor: 'var(--card-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            {card.title}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: card.color }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CrimeStats;
