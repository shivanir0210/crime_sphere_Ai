import React from 'react';

/**
 * MessageBubble component.
 * Renders individual chat messages for user and bot.
 */
function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
      <div className="message-bubble-wrapper">
        {/* Avatar */}
        <div className="message-avatar">
          {isUser ? (
            /* User icon */
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ) : (
            /* Shield icon for AI */
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
          )}
        </div>

        {/* Bubble Content */}
        <div className="message-bubble-content">
          <div className="message-meta">
            <span className="message-sender">
              {isUser ? 'Investigator' : 'CrimeSphere Assistant'}
            </span>
            <span style={{ margin: '0 6px', opacity: 0.5 }}>•</span>
            <span>{message.timestamp}</span>
          </div>
          
          <div className="message-bubble">
            {/* Split bot message findings into cleaner formatted structure if text contains repeat offenders list */}
            {message.text.includes('Found 3 repeat offenders') ? (
              <div>
                <p>{message.text}</p>
                <table>
                  <thead>
                    <tr>
                      <th>Offender ID</th>
                      <th>Name</th>
                      <th>Primary Offense</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#CS-9021</td>
                      <td>Kiran Kumar</td>
                      <td>Grand Theft Auto</td>
                      <td>Active Watchlist</td>
                    </tr>
                    <tr>
                      <td>#CS-7439</td>
                      <td>Rajesh Sekhar</td>
                      <td>Robbery / Assault</td>
                      <td>Parole Status</td>
                    </tr>
                    <tr>
                      <td>#CS-1082</td>
                      <td>Amit R. Gowda</td>
                      <td>Cyber Fraud</td>
                      <td>On Bail</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.text}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
