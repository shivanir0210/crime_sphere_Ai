import RiskScoreCard from './RiskScoreCard';
import ExplainablePanel from './ExplainablePanel';
import NetworkPreview from './NetworkPreview';
import HotspotCard from './HotspotCard';
import SimilarCases from './SimilarCases';
import LeadSuggestions from './LeadSuggestions';
import InvestigationAssistant from './InvestigationAssistant';
import { getTranslation, detectLanguage } from '../services/languageService';

/**
 * MessageBubble Component - Phase 4.
 * Renders user and bot messages. If bot response contains structured
 * intelligenceData, it displays a complete dashboard analysis brief.
 */
function MessageBubble({ message, sender, isLast, onSuggestionClick, isTyping, language = 'en' }) {
  const isUser = sender === 'user';
  
  // Extract text and intelligence payloads
  const text = typeof message === 'object' ? message.text : message;
  const intelligenceData = typeof message === 'object' ? message.intelligenceData : null;
  
  const timestamp = typeof message === 'object' && message.timestamp
    ? message.timestamp
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Web Speech API Voice Output
  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) {
      alert('Speech Synthesis API is not supported in this browser.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    } else {
      let speechContent = text;
      const activeLang = language === 'auto' ? 'en' : language;
      if (intelligenceData) {
        speechContent = intelligenceData.summary;
      } else if (message && message.analysis) {
        const speechLang = language === 'auto' ? detectLanguage(message.text || '') : language;
        const template = getTranslation('analysisSpeechTemplate', speechLang);
        speechContent = template
          .replace('{docName}', message.analysis.documentName || '')
          .replace('{crimeType}', message.analysis.crimeType || '')
          .replace('{riskLevel}', message.analysis.riskLevel || '')
          .replace('{victims}', message.analysis.victims || '')
          .replace('{suspects}', message.analysis.suspects || '');
      }
      
      const cleanSpeechText = speechContent
        .replace(/[🔍📍📊👥📄📋🎤🔊⭐]/gu, '')
        .replace(/\*/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
      
      const langCodes = {
        en: 'en-US',
        hi: 'hi-IN',
        kn: 'kn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        ml: 'ml-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        gu: 'gu-IN',
        pa: 'pa-IN',
        ur: 'ur-IN'
      };
      utterance.lang = langCodes[activeLang] || 'en-US';
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
      <div className="message-bubble-wrapper" style={{ maxWidth: intelligenceData ? '90%' : '75%' }}>
        <div className="message-avatar">
          {isUser ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          )}
        </div>

        <div className="message-bubble-content" style={{ width: '100%' }}>
          <div className="message-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
            <span>{isUser ? 'Investigator' : 'CrimeSphere Intelligence Hub'}</span>
            <span style={{ margin: '0 5px', opacity: 0.4 }}>•</span>
            <span>{timestamp}</span>
            
            {!isUser && (
              <button
                onClick={handleSpeak}
                style={{
                  marginLeft: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
                title="Read response aloud"
              >
                🔊 {getTranslation('readResponse', language)}
              </button>
            )}
          </div>

          <div className="message-bubble" style={{ width: '100%' }}>
            {/* 1. Uploaded Document Metadata Card */}
            {message && message.document ? (
              <div className="document-upload-card">
                <div className="doc-icon-wrapper">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="doc-meta-info">
                  <div className="doc-name">{message.document.name}</div>
                  <div className="doc-details">
                    <span>{message.document.type}</span>
                    <span className="dot-divider">•</span>
                    <span>{message.document.size}</span>
                    <span className="dot-divider">•</span>
                    <span>{message.document.time}</span>
                  </div>
                </div>
              </div>
            ) : message && message.analysis ? (
              /* 2. Document Analysis AI Report Card */
              <div className="document-analysis-card">
                <div className="analysis-card-header">
                  <div className="analysis-title">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span>{getTranslation('aiAnalysisTitle', language)}</span>
                  </div>
                  <span className={`badge badge-${message.analysis.riskLevel.toLowerCase()}`}>
                    {message.analysis.riskLevel} {getTranslation('riskLevel', language)}
                  </span>
                </div>

                <div className="analysis-card-body">
                  <div className="analysis-section">
                    <div className="analysis-section-title">{getTranslation('caseSummary', language)}</div>
                    <div className="analysis-summary-grid">
                      <div className="summary-item">
                        <span className="summary-label">{getTranslation('crimeType', language)}:</span>
                        <span className="summary-value">{message.analysis.crimeType}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">{getTranslation('victims', language)}:</span>
                        <span className="summary-value">{message.analysis.victims}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">{getTranslation('suspects', language)}:</span>
                        <span className="summary-value">{message.analysis.suspects}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">{getTranslation('riskLevel', language)}:</span>
                        <span className="summary-value text-glow-risk">{message.analysis.riskLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="analysis-section" style={{ marginTop: '12px' }}>
                    <div className="analysis-section-title">{getTranslation('locationsIdentified', language)}</div>
                    <div className="analysis-locations-list">
                      {message.analysis.locations.map((loc, i) => (
                        <div key={i} className="location-item">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{loc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : intelligenceData ? (
              /* 3. Structured Intelligence Report Render */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                
                {/* Header Brief Summary */}
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <span className="badge badge-accent" style={{ marginBottom: '6px' }}>
                    {getTranslation('intelligenceDispatch', language).toUpperCase()}
                  </span>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', fontWeight: '500' }}>
                    {intelligenceData.summary}
                  </p>
                </div>

                {/* Grid Visual Panels */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '12px',
                    width: '100%'
                  }}
                >
                  {/* Risk Score */}
                  <RiskScoreCard score={intelligenceData.riskScore} language={language} />

                  {/* Explainable AI */}
                  <ExplainablePanel
                    reasoning={intelligenceData.reasoning}
                    riskScore={intelligenceData.riskScore}
                    language={language}
                  />

                  {/* Network Graph */}
                  <NetworkPreview network={intelligenceData.network} language={language} />

                  {/* Hotspots */}
                  <HotspotCard hotspots={intelligenceData.hotspots} language={language} />

                  {/* Recommended Leads */}
                  <LeadSuggestions recommendations={intelligenceData.recommendations} language={language} />

                  {/* Similar Cases */}
                  <SimilarCases cases={intelligenceData.similarCases} language={language} />
                </div>
              </div>
            ) : (
              /* 4. Plain Text Render */
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
            )}
          </div>

          {/* Render Proactive AI Guidance suggestions */}
          {isLast && message.suggestions && message.suggestions.length > 0 && (
            <InvestigationAssistant
              suggestions={message.suggestions}
              onSuggestionClick={onSuggestionClick}
              disabled={isTyping}
              language={language}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
