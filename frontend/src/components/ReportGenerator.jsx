import { generatePoliceReport } from '../services/reportService';
import { getTranslation } from '../services/languageService';

/**
 * ReportGenerator Component
 * Renders the "Generate Report" button and triggers reportService PDF creation.
 */
function ReportGenerator({ activeIntel, activeChatTitle, timelineEvents, disabled, language = 'en' }) {
  const handleGenerate = () => {
    if (!activeIntel) {
      alert(getTranslation('noActiveCaseIntelAlert', language));
      return;
    }

    const reportData = {
      title: activeChatTitle,
      summary: activeIntel.summary,
      findings: activeIntel.reasoning || [],
      suspects: activeIntel.network || [],
      locations: activeIntel.hotspots || [],
      riskLevel: activeIntel.riskScore ? `${activeIntel.riskScore}/100` : 'N/A',
      recommendations: activeIntel.recommendations || [],
      timeline: timelineEvents || [],
      relatedCases: activeIntel.similarCases || []
    };

    generatePoliceReport(reportData, language);
  };

  return (
    <button
      className="btn btn-accent"
      onClick={handleGenerate}
      disabled={disabled || !activeIntel}
      style={{ padding: '6px 10px', fontSize: '11.5px' }}
      title={getTranslation('generateReportTooltip', language)}
    >
      📋 {getTranslation('generateReport', language)}
    </button>
  );
}

export default ReportGenerator;
