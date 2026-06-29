

import { getTranslation } from '../services/languageService';

/**
 * ExplainablePanel Component.
 * Visualizes the explainable reasoning parameters for a generated system result.
 */
function ExplainablePanel({ reasoning = [], riskScore = 0, language = 'en' }) {
  const defaultReasoning = [
    getTranslation('reasoning1', language),
    getTranslation('reasoning2', language),
    getTranslation('reasoning3', language)
  ];

  const points = reasoning.length > 0 ? reasoning : defaultReasoning;
  const descTemplate = getTranslation('explainableDesc', language);
  const descParts = descTemplate.split('{score}');

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
        <span>🧠</span> {getTranslation('explainableAiReasoning', language)}
      </h3>
      
      <div style={{ marginBottom: '14px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
        {descParts[0]}
        <strong style={{ color: 'var(--text-color)' }}>{riskScore}%</strong>
        {descParts[1] || ''}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {points.map((pt, idx) => (
          <li
            key={idx}
            style={{
              fontSize: '12px',
              color: 'var(--text-color)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            <span style={{ color: 'var(--accent-color)', fontWeight: '700' }}>•</span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExplainablePanel;
