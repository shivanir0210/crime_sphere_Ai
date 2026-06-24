import React, { useState } from 'react';

/**
 * ChatInput component.
 * Handles user text input, send action, and quick suggestion chips.
 */
function ChatInput({ onSendMessage, disabled }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion) => {
    if (disabled) return;
    onSendMessage(suggestion);
  };

  const suggestions = [
    'Show repeat offenders in Bengaluru',
    'Identify suspect connections',
    'Recent crime hotspots'
  ];

  return (
    <div className="chat-input-area">
      {/* Suggestion Chips */}
      <div className="suggestion-chips">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-chip"
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={disabled}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="input-row">
        <div className="input-wrapper">
          <input
            type="text"
            className="chat-input-field"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your investigative query here..."
            disabled={disabled}
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!inputValue.trim() || disabled}
        >
          <span>Send</span>
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
    </div>
  );
}

export default ChatInput;
