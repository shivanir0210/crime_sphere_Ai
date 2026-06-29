

import { getTranslation } from '../services/languageService';

/**
 * SimilarCases Component.
 * Displays list of historical related criminal cases.
 */
function SimilarCases({ cases = [], language = 'en' }) {
  const defaultCases = [
    { id: '101', title: getTranslation('similarCase1', language) },
    { id: '202', title: getTranslation('similarCase2', language) },
    { id: '305', title: getTranslation('similarCase3', language) }
  ];

  const list = cases.length > 0 ? cases : defaultCases;

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
        <span>📁</span> {getTranslation('relatedCases', language)}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {list.map((c, index) => (
          <div
            key={index}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              fontSize: '12.5px',
              color: 'var(--text-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: 'var(--accent-color)' }}>📄</span>
            <span>{c.title || c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimilarCases;
