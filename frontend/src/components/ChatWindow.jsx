import { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import InvestigationTimeline from './InvestigationTimeline';
import CrimeStats from './CrimeStats';
import RiskScoreCard from './RiskScoreCard';
import ExplainablePanel from './ExplainablePanel';
import NetworkPreview from './NetworkPreview';
import HotspotCard from './HotspotCard';
import SimilarCases from './SimilarCases';
import LeadSuggestions from './LeadSuggestions';
import ReportGenerator from './ReportGenerator';
import LanguageSwitcher from './LanguageSwitcher';
import { getTimeline, getTimelineType } from '../services/timelineService';
import { getTranslation } from '../services/languageService';

/**
 * ChatWindow Component - Phase 4.
 * Features:
 * - Toggleable Chat View vs Dashboard View.
 * - Dashboard View aggregates: stats widgets, risk ratings, XAI points, network logs, similar files, and timeline.
 * - PDF Export (completes structured reports).
 * - Case summary appender.
 * - Folder mapping select & Pin toggles.
 * - Inline Tag editor.
 */
function ChatWindow({
  messages = [],
  isTyping,
  folders = [],
  activeChatId,
  activeChatIsPinned,
  activeChatTitle = 'Investigation',
  activeChatIsFavorite = false,
  activeChatIsArchived = false,
  activeChatTags = [],
  activeContext = { crimeType: '', location: '', suspect: '', caseNumber: '' },
  onClearContext,
  onSendMessage,
  onUploadDocument,
  onClearCurrentChat,
  onTogglePinChat,
  onToggleFavoriteChat,
  onToggleArchiveChat,
  onMoveChatToFolder,
  onGenerateSummary,
  onAddTag,
  onRemoveTag,
  language,
  onLanguageChange,
  detectedLanguage = 'English'
}) {
  const messagesEndRef = useRef(null);

  // View Mode: 'chat' | 'dashboard'
  const [viewMode, setViewMode] = useState('chat');
  
  // Local state to toggle timeline side drawer (only visible in chat view mode)
  const [showTimeline, setShowTimeline] = useState(false);
  
  // Tag input triggers
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Auto scroll messages
  useEffect(() => {
    if (viewMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, viewMode]);

  const isFreshChat = messages.length <= 1;

  // Identify folder association
  const currentFolder = folders.find((f) => f.chatIds?.includes(activeChatId));
  const currentFolderId = currentFolder ? currentFolder.id : '';

  // Retrieve dynamic timeline events based on case title
  const [timelineEvents, setTimelineEvents] = useState([]);

  useEffect(() => {
    let active = true;
    const fetchTimeline = async () => {
      const activeTimelineType = getTimelineType(activeChatTitle);
      const data = await getTimeline(activeTimelineType, language);
      if (active) {
        setTimelineEvents(data || []);
      }
    };
    fetchTimeline();
    return () => {
      active = false;
    };
  }, [activeChatTitle, language]);

  // Retrieve intelligenceData payload from the last bot message in this case file
  const lastBotMsg = [...messages].reverse().find((m) => m.sender === 'bot' && m.intelligenceData);
  const activeIntel = lastBotMsg ? lastBotMsg.intelligenceData : null;

  // PDF Export
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text('CRIMESPHERE AI - INTEL REPORT', 20, yPosition);
      yPosition += 10;

      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition);
      yPosition += 6;

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text(`Investigation Title: ${activeChatTitle}`, 20, yPosition);
      yPosition += 6;

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Classification: CONFIDENTIAL // LAW ENFORCEMENT ONLY`, 20, yPosition);
      yPosition += 12;

      messages.forEach((msg) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }

        const senderLabel = msg.sender === 'user' ? 'INVESTIGATOR' : 'CRIMESPHERE ASSISTANT';
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(`[${senderLabel}]`, 20, yPosition);
        yPosition += 6;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);

        const textLines = doc.splitTextToSize(msg.text, 160);
        textLines.forEach((line) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 25, yPosition);
          yPosition += 6;
        });

        yPosition += 6;
      });

      doc.save(`CrimeSphere_Report_${activeChatTitle.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Error generating PDF report. Please verify connection.');
    }
  };

  const handleAddTagSubmit = (e) => {
    e.preventDefault();
    if (tagInput.trim()) {
      const cleanTag = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
      onAddTag(activeChatId, cleanTag);
      setTagInput('');
      setIsAddingTag(false);
    }
  };

  const suggestions = [
    { text: 'Show repeat offenders', label: '🔍 Show repeat offenders' },
    { text: 'Show crime hotspots', label: '📍 Show crime hotspots' },
    { text: 'Analyze cybercrime trends', label: '📊 Analyze cybercrime trends' },
    { text: 'Find criminal networks', label: '👥 Find criminal networks' }
  ];

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
      
      {/* Main Workspace Frame */}
      <div className="chatbot-chat-window" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Workspace controls header */}
        <header className="chat-header" style={{ height: 'auto', padding: '12px 20px', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Metadata */}
          <div className="chat-header-title-area">
            <h2 className="chat-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{activeChatTitle}</span>
              {activeChatIsFavorite && <span style={{ color: 'var(--warning-color)', fontSize: '14px' }}>★</span>}
            </h2>
            <div className="chat-header-subtitle">
              {getTranslation('secureConsole', language)}
            </div>
            <div className="detected-language-display" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              🌐 <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>{detectedLanguage}</span>
            </div>
          </div>
 
          {/* Active Context Memory Indicator */}
          {activeContext && (activeContext.crimeType || activeContext.location || activeContext.suspect || activeContext.caseNumber) && (
            <div
              className="active-context-indicator"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                backgroundColor: 'rgba(6, 182, 212, 0.05)',
                border: '1px dashed rgba(6, 182, 212, 0.25)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)'
              }}
            >
              <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>{getTranslation('memory', language)}:</span>
              {activeContext.crimeType && <span>{getTranslation('crime', language)}: <strong style={{ color: 'var(--text-color)' }}>{activeContext.crimeType}</strong></span>}
              {activeContext.location && <span>{getTranslation('loc', language)}: <strong style={{ color: 'var(--text-color)' }}>{activeContext.location}</strong></span>}
              {activeContext.suspect && <span>{getTranslation('suspect', language)}: <strong style={{ color: 'var(--text-color)' }}>{activeContext.suspect}</strong></span>}
              {activeContext.caseNumber && <span>{getTranslation('case', language)}: <strong style={{ color: 'var(--text-color)' }}>{activeContext.caseNumber}</strong></span>}
              <button
                onClick={onClearContext}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--danger-color)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginLeft: '4px',
                  fontSize: '10px',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)'
                }}
                title="Clear active context"
              >
                ✕ {getTranslation('clear', language)}
              </button>
            </div>
          )}

          {/* Action Row */}
          <div
            className="chat-header-actions"
            style={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginLeft: 'auto'
            }}
          >
            {/* View Mode Toggle: Chat vs Dashboard */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '2px',
                marginRight: '8px'
              }}
            >
              <button
                onClick={() => setViewMode('chat')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  border: 'none',
                  background: viewMode === 'chat' ? 'var(--accent-color)' : 'transparent',
                  color: viewMode === 'chat' ? 'var(--bg-color)' : 'var(--text-color)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {getTranslation('chatView', language)}
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  border: 'none',
                  background: viewMode === 'dashboard' ? 'var(--accent-color)' : 'transparent',
                  color: viewMode === 'dashboard' ? 'var(--bg-color)' : 'var(--text-color)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {getTranslation('dashboardView', language)}
              </button>
            </div>

            {/* Language Switcher component */}
            <LanguageSwitcher value={language} onChange={onLanguageChange} />
 
            {/* Folder Dropdown Select */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '2px 8px'
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>📁 {getTranslation('folder', language)}:</span>
              <select
                value={currentFolderId}
                onChange={(e) => onMoveChatToFolder(activeChatId, e.target.value)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-color)',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '4px 0'
                }}
              >
                <option value="" style={{ backgroundColor: 'var(--card-color)' }}>
                  {getTranslation('fileUnassigned', language)}
                </option>
                {folders.map((f) => (
                  <option
                    key={f.id}
                    value={f.id}
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Favorite Star Toggle */}
            <button
              className="btn btn-secondary"
              onClick={() => onToggleFavoriteChat(activeChatId)}
              style={{
                padding: '6px 10px',
                fontSize: '11.5px',
                backgroundColor: activeChatIsFavorite ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                borderColor: activeChatIsFavorite ? 'var(--warning-color)' : 'var(--border-color)',
                color: activeChatIsFavorite ? 'var(--warning-color)' : 'var(--text-color)'
              }}
              title={activeChatIsFavorite ? getTranslation('unfavorite', language) : getTranslation('favorite', language)}
            >
              ★
            </button>

            {/* Pin Chat Toggle */}
            <button
              className="btn btn-secondary"
              onClick={() => onTogglePinChat(activeChatId)}
              style={{
                padding: '6px 10px',
                fontSize: '11.5px',
                backgroundColor: activeChatIsPinned ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                borderColor: activeChatIsPinned ? 'var(--accent-color)' : 'var(--border-color)',
                color: activeChatIsPinned ? 'var(--accent-color)' : 'var(--text-color)'
              }}
              title={activeChatIsPinned ? getTranslation('unpin', language) : getTranslation('pin', language)}
            >
              📌
            </button>
 
            {/* Archive Toggle */}
            <button
              className="btn btn-secondary"
              onClick={() => onToggleArchiveChat(activeChatId)}
              style={{
                padding: '6px 10px',
                fontSize: '11.5px',
                backgroundColor: activeChatIsArchived ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderColor: 'var(--border-color)',
                color: activeChatIsArchived ? 'var(--accent-color)' : 'var(--text-color)'
              }}
              title={activeChatIsArchived ? getTranslation('restore', language) : getTranslation('archiveAction', language)}
            >
              📦
            </button>
 
            {/* PDF Export Trigger */}
            <button
              className="btn btn-secondary"
              onClick={handleExportPDF}
              style={{ padding: '6px 10px', fontSize: '11.5px' }}
              title={getTranslation('exportPdf', language)}
            >
              📄 {getTranslation('exportPdf', language)}
            </button>
 
            {/* Investigation Report Generator */}
            <ReportGenerator
              activeIntel={activeIntel}
              activeChatTitle={activeChatTitle}
              timelineEvents={timelineEvents}
              disabled={isTyping}
              language={language}
            />
 
            {/* Case Summary Generator Trigger */}
            <button
              className="btn btn-secondary"
              onClick={onGenerateSummary}
              style={{ padding: '6px 10px', fontSize: '11.5px' }}
              title={getTranslation('summary', language)}
            >
              📋 {getTranslation('summary', language)}
            </button>
 
            {/* Toggle Timeline Panel Trigger (Only in Chat Mode) */}
            {viewMode === 'chat' && (
              <button
                className="btn btn-secondary"
                onClick={() => setShowTimeline(!showTimeline)}
                style={{
                  padding: '6px 10px',
                  fontSize: '11.5px',
                  borderColor: showTimeline ? 'var(--accent-color)' : 'var(--border-color)',
                  color: showTimeline ? 'var(--accent-color)' : 'var(--text-color)'
                }}
                title={getTranslation('timeline', language)}
              >
                📅 {getTranslation('timeline', language)}
              </button>
            )}

            {/* Delete Chat */}
            <button
              className="btn btn-secondary"
              onClick={onClearCurrentChat}
              style={{
                padding: '6px 10px',
                fontSize: '11.5px',
                borderColor: 'var(--border-color)',
                color: 'var(--danger-color)'
              }}
              title={getTranslation('deleteAction', language)}
            >
              🗑️
            </button>
          </div>
        </header>

        {/* Tags management bar */}
        <div
          style={{
            padding: '6px 20px',
            backgroundColor: 'rgba(0,0,0,0.15)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>{getTranslation('search', language)} {getTranslation('tags', language)}:</span>
          {activeChatTags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                color: 'var(--accent-color)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {tag}
              <button
                onClick={() => onRemoveTag(activeChatId, tag)}
                style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontSize: '9px', padding: '0 2px' }}
                title={getTranslation('deleteAction', language)}
              >
                ✕
              </button>
            </span>
          ))}

          {/* Add Tag Inline Form */}
          {isAddingTag ? (
            <form onSubmit={handleAddTagSubmit} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. CyberCrime"
                style={{
                  fontSize: '11px',
                  backgroundColor: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-color)',
                  padding: '2px 6px',
                  outline: 'none',
                  borderRadius: 'var(--radius-sm)'
                }}
                autoFocus
              />
              <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '11px' }}>✓</button>
              <button onClick={() => setIsAddingTag(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--danger-color)' }}>✕</button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingTag(true)}
              style={{
                fontSize: '11px',
                background: 'transparent',
                border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '2px 8px',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              {getTranslation('addTag', language)}
            </button>
          )}
        </div>

        {/* View Mode Switching panels */}
        {viewMode === 'chat' ? (
          /* ==================== 1. CHAT VIEW MODE ==================== */
          <>
            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto' }}>
              {messages.map((msg, idx) => {
                const isLast = idx === messages.length - 1;
                return (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    sender={msg.sender}
                    isLast={isLast}
                    onSuggestionClick={onSendMessage}
                    isTyping={isTyping}
                    language={language}
                  />
                );
              })}

              {/* Suggestions Grid */}
              {isFreshChat && (
                <div className="suggestion-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  marginTop: '24px',
                  padding: '0 12px'
                }}>
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      className="card card-interactive"
                      onClick={() => onSendMessage(sug.text)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--card-color)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-color)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '500',
                        lineHeight: '1.4',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading indicator */}
              {isTyping && (
                <div className="message-row bot">
                  <div className="message-bubble-wrapper">
                    <div className="message-avatar">
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
                    </div>
                    <div className="message-bubble-content">
                      <div className="message-meta">
                        <span>CrimeSphere Assistant</span>
                        <span style={{ margin: '0 5px', opacity: 0.4 }}>•</span>
                        <span>Connecting...</span>
                      </div>
                      <div className="typing-indicator">
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginRight: '8px' }}>
                          Analyzing crime records...
                        </span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <ChatInput onSendMessage={onSendMessage} onUploadDocument={onUploadDocument} disabled={isTyping} language={language} />
          </>
        ) : (
          /* ==================== 2. DASHBOARD VIEW MODE ==================== */
          <div
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              overflowY: 'auto',
              flex: 1,
              backgroundColor: 'var(--bg-color)'
            }}
          >
            {activeIntel ? (
              <>
                {/* Stats Header widget */}
                <CrimeStats
                  stats={{
                    totalCases: activeIntel.riskScore > 80 ? 42 : 15,
                    repeatOffenders: activeIntel.riskScore > 80 ? 3 : 1,
                    hotspotsCount: activeIntel.hotspots.length,
                    highRiskCount: activeIntel.riskScore > 80 ? 1 : 0
                  }}
                  language={language}
                />

                {/* Dashboard grid panel containing all visual cards */}
                <div className="dashboard-grid" style={{ marginTop: '10px' }}>
                  {/* Risk Score */}
                  <RiskScoreCard score={activeIntel.riskScore} language={language} />

                  {/* Explainable AI reasoning */}
                  <ExplainablePanel
                    reasoning={activeIntel.reasoning}
                    riskScore={activeIntel.riskScore}
                    language={language}
                  />

                  {/* Network Graph tree */}
                  <NetworkPreview network={activeIntel.network} language={language} />

                  {/* Hotspots Map coordinates */}
                  <HotspotCard hotspots={activeIntel.hotspots} language={language} />

                  {/* Case Timeline */}
                  <div className="card" style={{ padding: '16px' }}>
                    <InvestigationTimeline events={timelineEvents} language={language} />
                  </div>

                  {/* Recommended leads */}
                  <LeadSuggestions recommendations={activeIntel.recommendations} language={language} />

                  {/* Similar Cases */}
                  <SimilarCases cases={activeIntel.similarCases} language={language} />
                </div>
              </>
            ) : (
              /* No Intelligence Data Loaded Placeholder */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  padding: '40px',
                  textAlign: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '48px' }}>⚠️</div>
                <h3 style={{ color: 'var(--text-color)', fontSize: '18px' }}>{getTranslation('noIntelTitle', language)}</h3>
                <p style={{ maxWidth: '460px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                  {getTranslation('noIntelDesc', language)}
                </p>
                <button
                  className="btn btn-accent"
                  onClick={() => setViewMode('chat')}
                  style={{ marginTop: '8px' }}
                >
                  {getTranslation('noIntelBtn', language)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Drawer: Timeline (Only in Chat Mode) */}
      {showTimeline && viewMode === 'chat' && (
        <div
          className="card"
          style={{
            width: '280px',
            borderLeft: '1px solid var(--border-color)',
            borderRadius: 0,
            borderRight: 'none',
            borderTop: 'none',
            borderBottom: 'none',
            backgroundColor: 'var(--card-color)',
            overflowY: 'auto',
            animation: 'slideIn 0.3s ease-out forwards',
            zIndex: 4
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 10px 0 0' }}>
            <button
              onClick={() => setShowTimeline(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              title="Hide Timeline Panel"
            >
              ✕
            </button>
          </div>
          <InvestigationTimeline events={timelineEvents} language={language} />
        </div>
      )}
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default ChatWindow;
