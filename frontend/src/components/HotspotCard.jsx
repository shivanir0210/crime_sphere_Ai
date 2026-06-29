

import { getTranslation } from '../services/languageService';

/**
 * HotspotCard Component.
 * Displays crime hotspots list categorized by risk levels.
 */
function HotspotCard({ hotspots = [], language = 'en' }) {
  const defaultHotspots = [
    { location: 'Bengaluru Urban', risk: 'High' },
    { location: 'Mysuru', risk: 'Medium' },
    { location: 'Hubli', risk: 'Low' }
  ];

  const list = hotspots.length > 0 ? hotspots : defaultHotspots;

  return (
    <div
      className="card"
      style={{
        backgroundColor: 'var(--card-color)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <h3
        style={{
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: 'var(--accent-color)',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '8px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>📍</span> {getTranslation('crimeHotspotsRegistry', language)}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {list.map((spot, index) => {
          let riskColor = 'var(--text-secondary)';
          let riskBg = 'rgba(255, 255, 255, 0.02)';

          if (spot.risk.toLowerCase() === 'high') {
            riskColor = 'var(--danger-color)';
            riskBg = 'rgba(239, 68, 68, 0.05)';
          } else if (spot.risk.toLowerCase() === 'medium') {
            riskColor = 'var(--warning-color)';
            riskBg = 'rgba(245, 158, 11, 0.05)';
          } else if (spot.risk.toLowerCase() === 'low') {
            riskColor = 'var(--success-color)';
            riskBg = 'rgba(34, 197, 94, 0.05)';
          }

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: riskBg,
                border: '1px solid var(--border-color)'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-color)' }}>
                📍 {spot.location}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  color: riskColor
                }}
              >
                {getTranslation('risk', language)}: {getTranslation(spot.risk.toLowerCase(), language)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HotspotCard;
