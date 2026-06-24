import React from 'react';

/**
 * Sidebar component for Chatbot page.
 * Displays CrimeSphere AI branding, actions, and historical sessions.
 */
function Sidebar({ chatHistory = [], activeChatId, onSelectChat, onNewChat }) {
  return (
    <aside className="chatbot-sidebar">
      {/* Sidebar Header: Branding */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg
            className="logo-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Tactical Shield Target icon */}
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <circle cx="12" cy="11" r="3" />
            <path d="M12 5v3M12 14v3M8 11H5M19 11h-3" />
          </svg>
          <span className="logo-text">CrimeSphere AI</span>
        </div>
        <div className="logo-sub">INTELLIGENCE NETWORK</div>
      </div>

      {/* Sidebar Action: New Chat */}
      <div className="sidebar-actions">
        <button className="new-chat-btn" onClick={onNewChat}>
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Chat
        </button>
      </div>

      {/* Sidebar Navigation: Chat History */}
      <div className="sidebar-history">
        <div className="history-title">Recent Investigations</div>
        <ul className="history-list">
          {chatHistory.map((chat) => (
            <li key={chat.id}>
              <button
                className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                onClick={() => onSelectChat(chat.id)}
                title={chat.title}
              >
                {/* Chat bubble icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {chat.title}
              </button>
            </li>
          ))}
          {chatHistory.length === 0 && (
            <div style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--cs-text-muted)', fontStyle: 'italic' }}>
              No recent investigations
            </div>
          )}
        </ul>
      </div>

      {/* Sidebar Footer: System Status */}
      <div className="sidebar-status">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>SECURE ENDPOINT</span>
        </div>
        <div style={{ fontSize: '9px', fontFamily: 'monospace', opacity: 0.6 }}>
          TLS_1.3
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
