

import { getTranslation } from '../services/languageService';

/**
 * LeadSuggestions Component.
 * Displays list of recommended next steps and investigative directions.
 */
function LeadSuggestions({ recommendations = [], language = 'en' }) {
  const defaultLeads = [
    getTranslation('lead1', language),
    getTranslation('lead2', language),
    getTranslation('lead3', language)
  ];

  const leads = recommendations.length > 0 ? recommendations : defaultLeads;

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
        <span>💡</span> {getTranslation('recommendedLeads', language)}
      </h3>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {leads.map((lead, index) => (
          <li
            key={index}
            style={{
              fontSize: '12px',
              color: 'var(--text-color)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            <span style={{ color: 'var(--accent-color)', fontWeight: '700' }}>→</span>
            <span>{lead}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeadSuggestions;
