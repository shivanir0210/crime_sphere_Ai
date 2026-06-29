

import { getTranslation } from '../services/languageService';

/**
 * Dynamic InvestigationTimeline Component.
 * Receives milestone events via props. Displays placeholder message if events are unavailable.
 */
function InvestigationTimeline({ events, language = 'en' }) {
  if (!events || events.length === 0) {
    return (
      <div className="investigation-timeline" style={{ padding: '16px', color: 'var(--text-color)', textAlign: 'center' }}>
        <h3
          style={{
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '8px',
            marginBottom: '16px',
            color: 'var(--accent-color)',
            textAlign: 'left'
          }}
        >
          <span>📅</span> {getTranslation('timeline', language)}
        </h3>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            marginTop: '24px'
          }}
        >
          {getTranslation('timelineDataNotAvailable', language)}
        </p>
      </div>
    );
  }

  return (
    <div className="investigation-timeline" style={{ padding: '16px', color: 'var(--text-color)' }}>
      <h3
        style={{
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '8px',
          marginBottom: '16px',
          color: 'var(--accent-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>📅</span> {getTranslation('timeline', language)}
      </h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          paddingLeft: '16px',
          borderLeft: '2px dashed var(--border-color)',
          marginLeft: '6px'
        }}
      >
        {events.map((ev, index) => (
          <div key={index} style={{ position: 'relative' }}>
            {/* Timeline node dot */}
            <span
              style={{
                position: 'absolute',
                left: '-23px',
                top: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: index === events.length - 1 ? 'var(--success-color)' : 'var(--accent-color)',
                border: '2px solid var(--bg-color)',
                boxShadow: index === events.length - 1 ? 'var(--glow-success)' : 'var(--glow-accent)'
              }}
            ></span>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '2px' }}>
              {ev.date}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-color)' }}>
              {ev.title}
            </div>
            {ev.desc && (
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {ev.desc}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvestigationTimeline;
