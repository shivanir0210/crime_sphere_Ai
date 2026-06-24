import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

/**
 * ChatWindow component.
 * Manages the scrollable chat history container and handles auto-scrolling on new messages.
 */
function ChatWindow({ messages = [], isTyping, onSendMessage }) {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages or typing status updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chatbot-chat-window">
      {/* Chat Header */}
      <header className="chat-header">
        <div className="chat-header-title-area">
          <h2 className="chat-header-title">CrimeSphere AI Assistant</h2>
          <div className="chat-header-subtitle">
            Secure Cryptographic Channel
          </div>
        </div>
        <div className="chat-header-status">
          INTELLIGENCE_STREAM_ONLINE
        </div>
      </header>

      {/* Scrollable Messages viewport */}
      <div className="chat-messages">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="message-row bot">
            <div className="message-bubble-wrapper">
              <div className="message-avatar">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="message-bubble-content">
                <div className="message-meta">
                  <span className="message-sender">CrimeSphere Assistant</span>
                  <span style={{ margin: '0 6px', opacity: 0.5 }}>•</span>
                  <span>Analyzing...</span>
                </div>
                <div className="typing-indicator">
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

      {/* Bottom Input Area */}
      <ChatInput onSendMessage={onSendMessage} disabled={isTyping} />
    </div>
  );
}

export default ChatWindow;
