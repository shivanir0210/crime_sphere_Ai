import { getTranslation } from '../services/languageService';

/**
 * InvestigationAssistant Component
 * Displays dynamic follow-up recommendation chips at the bottom of bot responses.
 * Clicking a chip automatically triggers sending the action query.
 */
function InvestigationAssistant({ suggestions = [], onSuggestionClick, disabled, language = 'en' }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="assistant-suggestions-area">
      <div className="assistant-header-title">💡 {getTranslation('suggestedNextActions', language)}:</div>
      <div className="assistant-chips-container">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            className="assistant-chip"
            onClick={() => !disabled && onSuggestionClick(suggestion)}
            disabled={disabled}
            title={`${getTranslation('investigation', language)}: ${suggestion}`}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default InvestigationAssistant;
