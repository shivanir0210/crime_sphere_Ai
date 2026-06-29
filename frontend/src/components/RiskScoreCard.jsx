

import { getTranslation } from '../services/languageService';

/**
 * RiskScoreCard Component.
 * Displays numerical risk scores with associated level ratings and color-coded status rings/backgrounds.
 */
function RiskScoreCard({ score = 0, language = 'en' }) {
  // Determine risk level and colors from design variables
  let level = 'Low';
  let badgeClass = 'badge-success';
  let colorVar = 'var(--success-color)';
  let glowVar = 'var(--glow-success)';

  if (score > 70) {
    level = 'High';
    badgeClass = 'badge-danger';
    colorVar = 'var(--danger-color)';
    glowVar = 'var(--glow-danger)';
  } else if (score > 40) {
    level = 'Medium';
    badgeClass = 'badge-warning';
    colorVar = 'var(--warning-color)';
    glowVar = 'var(--glow-warning)';
  }

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'var(--card-color)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
        {getTranslation('systemRiskAssessment', language)}
      </div>
      
      {/* Circle Ring Container */}
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: `4px solid ${colorVar}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: glowVar,
          marginBottom: '12px'
        }}
      >
        <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-color)', lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>/100</span>
      </div>

      <div className={`badge ${badgeClass}`} style={{ fontSize: '12px', padding: '6px 12px' }}>
        {getTranslation('level', language).toUpperCase()}: {getTranslation(level.toLowerCase(), language).toUpperCase()}
      </div>
    </div>
  );
}

export default RiskScoreCard;
