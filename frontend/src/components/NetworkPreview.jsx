import React from 'react';
import { getTranslation } from '../services/languageService';

/**
 * NetworkPreview Component.
 * Visualizes connection trees between suspect nodes, financial transits, and co-accused logs.
 */
function NetworkPreview({ network = [], language = 'en' }) {
  const defaultNetwork = [
    { from: getTranslation('suspectA', language), relation: getTranslation('associateRelation', language), to: getTranslation('suspectB', language) },
    { from: getTranslation('suspectB', language), relation: getTranslation('wireTransferRelation', language), to: getTranslation('suspectC', language) }
  ];

  const connections = network.length > 0 ? network : defaultNetwork;

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
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>👥</span> {getTranslation('suspectNetworkPreview', language)}
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 0'
        }}
      >
        {connections.map((conn, idx) => (
          <React.Fragment key={idx}>
            {/* Top Node */}
            <div
              style={{
                width: '100%',
                maxWidth: '160px',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                fontSize: '12.5px',
                fontWeight: '600',
                color: 'var(--text-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {conn.from}
            </div>

            {/* Relation Arrow */}
            <div
              style={{
                fontSize: '11px',
                color: 'var(--accent-color)',
                fontWeight: '700',
                textAlign: 'center',
                margin: '2px 0'
              }}
            >
              {conn.relation}
            </div>

            {/* Render Bottom Node only if this is the last connection in the array */}
            {idx === connections.length - 1 && (
              <div
                style={{
                  width: '100%',
                  maxWidth: '160px',
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: 'var(--text-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {conn.to}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default NetworkPreview;
