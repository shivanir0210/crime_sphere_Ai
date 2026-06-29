import { useState, useRef, useEffect } from 'react';
import UploadDocument from './UploadDocument';
import { getTranslation, translateText } from '../services/languageService';

const suggestions = [
  'Show repeat offenders',
  'Show crime hotspots',
  'Show cybercrime cases',
  'Show high risk offenders'
];

/**
 * ChatInput Component - Phase 4.
 * Handles text input, form submissions, and SpeechRecognition (Voice Input)
 * with robust debugging, en-US mapping, and status indicators.
 */
function ChatInput({ onSendMessage, onUploadDocument, disabled, language = 'en' }) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState(''); // Status indicators state
  const [translatedSuggestions, setTranslatedSuggestions] = useState([]);
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled) return;
    
    onSendMessage(inputValue.trim());
    setInputValue('');
    setVoiceStatus(''); // Reset voice status on send
  };

  // Toggle voice recognition
  const toggleListening = (e) => {
    e.preventDefault();
    console.log("Mic button clicked");
    
    if (isListening) {
      console.log("Stopping SpeechRecognition manually");
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API unavailable in this browser");
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    try {
      console.log("SpeechRecognition instance created");
      const recognition = new SpeechRecognition();
      
      // Configuration settings
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log("🎤 Voice Started");
        setIsListening(true);
        setVoiceStatus(`🎤 ${getTranslation('listening', language)}`);
      };

      recognition.onerror = (event) => {
        console.error("ERROR TYPE:", event.error);
        console.error("FULL EVENT:", event);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("🛑 Voice Ended");
        setIsListening(false);
        setVoiceStatus((prev) => prev.startsWith('❌') ? prev : `🛑 ${getTranslation('listeningStop', language)}`);
      };

      recognition.onresult = (event) => {
        console.log("RESULT:", event);

        let transcript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        console.log("TRANSCRIPT:", transcript);

        setInputValue(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setVoiceStatus('❌ Error: Initialization failed');
      setIsListening(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (disabled) return;
    onSendMessage(suggestion);
  };

  useEffect(() => {
    const translateAll = async () => {
      const activeLang = language === 'auto' ? 'en' : language;
      const list = await Promise.all(
        suggestions.map(s => translateText(s, activeLang))
      );
      setTranslatedSuggestions(list);
    };
    translateAll();
  }, [language]);

  return (
    <div className="chat-input-area">
      {/* Suggestions shortcuts */}
      <div className="suggestion-chips">
        {translatedSuggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-chip"
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={disabled}
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-row">
        <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Microphone Toggle Button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isListening ? 'var(--danger-color)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: isListening ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              transition: 'all var(--transition-fast)',
              boxShadow: isListening ? 'var(--glow-danger)' : 'none'
            }}
            title={isListening ? 'Stop Listening' : 'Start Listening (Microphone)'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
            </svg>
          </button>

          {/* FIR & Document Upload Button */}
          <UploadDocument onUpload={onUploadDocument} disabled={disabled} />

          {/* Bound Input Field */}
          <input
            type="text"
            className="chat-input-field"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? getTranslation('listeningPlaceholder', language) : getTranslation('placeholder', language)}
            disabled={disabled}
            autoFocus
          />
        </div>
        
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!inputValue.trim() || disabled}
        >
          <span>{getTranslation('send', language)}</span>
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
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>

      {/* Voice Recognition Status Banner */}
      {voiceStatus && (
        <div
          style={{
            fontSize: '11px',
            color: voiceStatus.startsWith('❌') ? 'var(--danger-color)' : 'var(--accent-color)',
            marginTop: '6px',
            paddingLeft: '36px',
            fontWeight: '600',
            transition: 'all var(--transition-fast)'
          }}
        >
          {voiceStatus}
        </div>
      )}
    </div>
  );
}

export default ChatInput;
