import { useState, useEffect } from 'react';
import { searchChats, searchFolders, getHighlightParts } from '../utils/searchUtils';
import { getTranslation } from '../services/languageService';

/**
 * Sidebar Component - Phase 3 Workspace.
 * Features:
 * - Real-time global search with text highlighting.
 * - Dynamic tag filters.
 * - Inline case renaming & inline folder renaming.
 * - ⋮ Dropdown menus next to chats & folders.
 * - Empty search state.
 */
function Sidebar({
  chatHistory = [],
  folders = [],
  activeChatId,
  searchQuery = '',
  setSearchQuery,
  selectedTag = '',
  setSelectedTag,
  onSelectChat,
  onNewChat,
  onNewFolder,
  onRenameFolder,
  onDeleteFolder,
  onRenameChat,
  onTogglePinChat,
  onToggleFavoriteChat,
  onToggleArchiveChat,
  onDeleteChat,
  language = 'en'
}) {
  // Dropdown Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Inline Rename States
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingChatValue, setEditingChatValue] = useState('');
  
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderValue, setEditingFolderValue] = useState('');

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Filter lists using the search utilities
  const filteredActiveChats = searchChats(chatHistory.filter(c => !c.archived), searchQuery, selectedTag);
  const filteredArchivedChats = searchChats(chatHistory.filter(c => c.archived), searchQuery, selectedTag);
  
  const filteredFolders = searchFolders(folders, chatHistory, searchQuery, selectedTag);

  // Partition chats
  const pinnedChats = filteredActiveChats.filter((c) => c.pinned);
  const favoriteChats = filteredActiveChats.filter((c) => c.favorite);

  const allFolderChatIds = folders.reduce((acc, f) => [...acc, ...(f.chatIds || [])], []);
  const recentChats = filteredActiveChats.filter(
    (c) => !c.pinned && !c.favorite && !allFolderChatIds.includes(c.id)
  );

  // Check if workspace search returned absolutely zero results
  const isSearchEmpty =
    searchQuery.trim() !== '' &&
    pinnedChats.length === 0 &&
    favoriteChats.length === 0 &&
    recentChats.length === 0 &&
    filteredArchivedChats.length === 0 &&
    filteredFolders.length === 0;

  // Handler to trigger chat renaming
  const startChatRename = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingChatValue(chat.title);
    setActiveMenuId(null);
  };

  // Save chat title
  const saveChatRename = (chatId) => {
    if (editingChatValue.trim()) {
      onRenameChat(chatId, editingChatValue.trim());
    }
    setEditingChatId(null);
  };

  // Handler to trigger folder renaming
  const startFolderRename = (e, folder) => {
    e.stopPropagation();
    setEditingFolderId(folder.id);
    setEditingFolderValue(folder.name);
    setActiveMenuId(null);
  };

  // Save folder title
  const saveFolderRename = (folderId) => {
    if (editingFolderValue.trim()) {
      onRenameFolder(folderId, editingFolderValue.trim());
    }
    setEditingFolderId(null);
  };

  // Menu toggler helper
  const toggleMenu = (e, menuId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === menuId ? null : menuId);
  };

  // Helper to render text with matching highlight segments
  const renderHighlightedText = (text, query) => {
    const parts = getHighlightParts(text, query);
    return parts.map((part, index) =>
      part.highlight ? (
        <span
          key={index}
          style={{
            color: 'var(--accent-color)',
            fontWeight: '700',
            textShadow: '0 0 6px rgba(6, 182, 212, 0.4)'
          }}
        >
          {part.text}
        </span>
      ) : (
        part.text
      )
    );
  };

  // Helper to render translated chat actions dropdown menu
  const renderChatMenu = (chat) => {
    if (chat.archived) {
      return (
        <>
          <button onClick={(e) => startChatRename(e, chat)} style={{ display: 'block', width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--text-color)', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>✏️ {getTranslation('rename', language)}</button>
          <button onClick={(e) => { e.stopPropagation(); onToggleArchiveChat(chat.id); }} style={{ display: 'block', width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--text-color)', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>📦 {getTranslation('restore', language)}</button>
          <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }} style={{ display: 'block', width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--danger-color)', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>🗑️ {getTranslation('deleteAction', language)}</button>
        </>
      );
    }
    return (
      <>
        <button onClick={(e) => startChatRename(e, chat)} style={{ display: 'block', width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--text-color)', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>✏️ {getTranslation('rename', language)}</button>
        <button onClick={(e) => { e.stopPropagation(); onTogglePinChat(chat.id); }} style={{ display: 'block', width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--text-color)', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>📌 {chat.pinned ? getTranslation('unpin', language) : getTranslation('pin', language)}</button>
        <button onClick={(e) => { e.stopPropagation(); onToggleFavoriteChat(chat.id); }} style={{ display: 'block', width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--text-color)', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>{chat.favorite ? `★ ${getTranslation('unfavorite', language)}` : `☆ ${getTranslation('favorite', language)}`}</button>
        <button onClick={(e) => { e.stopPropagation(); onToggleArchiveChat(chat.id); }} style={{ display: 'block', width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--text-color)', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>📦 {getTranslation('archiveAction', language)}</button>
        <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }} style={{ display: 'block', width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--danger-color)', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>🗑️ {getTranslation('deleteAction', language)}</button>
      </>
    );
  };

  return (
    <aside className="chatbot-sidebar">
      {/* Branding */}
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <circle cx="12" cy="11" r="3" />
            <path d="M12 5v3M12 14v3M8 11H5M19 11h-3" />
          </svg>
          <span className="logo-text">CrimeSphere AI</span>
        </div>
        <div className="logo-sub">{getTranslation('investigation', language)}</div>
      </div>

      {/* Action Buttons */}
      <div className="sidebar-actions" style={{ display: 'flex', gap: '8px', padding: '12px 16px 4px' }}>
        <button
          className="new-chat-btn"
          style={{ flex: 1, padding: '8px 6px', fontSize: '12px' }}
          onClick={onNewChat}
        >
          ➕ {getTranslation('newChat', language)}
        </button>
        <button
          className="new-chat-btn"
          style={{
            flex: 1,
            padding: '8px 6px',
            fontSize: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'var(--border-color)'
          }}
          onClick={onNewFolder}
        >
          📂 {getTranslation('folder', language)}
        </button>
      </div>

      {/* Global Search Input */}
      <div style={{ padding: '8px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2px 8px'
          }}
        >
          <span style={{ fontSize: '12px', opacity: 0.5, marginRight: '6px' }}>🔍</span>
          <input
            type="text"
            className="chat-input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${getTranslation('search', language)}...`}
            style={{ fontSize: '12px', padding: '6px 0' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '11px' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tag Filters list */}
      {chatHistory.flatMap(c => c.tags || []).length > 0 && (
        <div style={{ padding: '4px 16px 8px', overflowX: 'auto', display: 'flex', gap: '6px', whiteSpace: 'nowrap' }}>
          {Array.from(new Set(chatHistory.flatMap(c => c.tags || []))).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              style={{
                fontSize: '10px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedTag === tag ? 'var(--accent-color)' : 'var(--border-color)',
                backgroundColor: selectedTag === tag ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: selectedTag === tag ? 'var(--accent-color)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Main workspace navigation scroll container */}
      <div
        className="sidebar-history"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Empty Search State */}
        {isSearchEmpty && (
          <div style={{ padding: '24px 12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            {getTranslation('noInvestigationsFound', language)}
          </div>
        )}

        {/* Pinned Section */}
        {pinnedChats.length > 0 && (
          <div>
            <div className="history-title">📌 {getTranslation('pinned', language)}</div>
            <ul className="history-list">
              {pinnedChats.map((chat) => (
                <li key={chat.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
                  {editingChatId === chat.id ? (
                    <input
                      value={editingChatValue}
                      onChange={(e) => setEditingChatValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveChatRename(chat.id);
                        if (e.key === 'Escape') setEditingChatId(null);
                      }}
                      onBlur={() => saveChatRename(chat.id)}
                      style={{
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--accent-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 6px',
                        fontSize: '12px',
                        outline: 'none',
                        width: '100%'
                      }}
                      autoFocus
                    />
                  ) : (
                    <>
                      <button
                        className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                        onClick={() => onSelectChat(chat.id)}
                        style={{ flex: 1, overflow: 'hidden' }}
                      >
                        <span>📌</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {renderHighlightedText(chat.title, searchQuery)}
                        </span>
                      </button>

                      {/* ⋮ Action Menu button */}
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={(e) => toggleMenu(e, `chat-${chat.id}`)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px', fontSize: '14px' }}
                        >
                          ⋮
                        </button>
                        {activeMenuId === `chat-${chat.id}` && (
                          <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '24px',
                            backgroundColor: 'var(--card-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 10,
                            minWidth: '120px',
                            padding: '4px 0'
                          }}>
                            {renderChatMenu(chat)}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Folders Section */}
        {filteredFolders.length > 0 && (
          <div>
            <div className="history-title">📁 {getTranslation('foldersTitle', language)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredFolders.map((folder) => {
                const folderChats = filteredActiveChats.filter((c) =>
                  folder.chatIds?.includes(c.id)
                );

                return (
                  <div
                    key={folder.id}
                    className="card"
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.01)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    {/* Folder Title renamed or menu dropdown */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                        paddingBottom: '4px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      {editingFolderId === folder.id ? (
                        <input
                          value={editingFolderValue}
                          onChange={(e) => setEditingFolderValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveFolderRename(folder.id);
                            if (e.key === 'Escape') setEditingFolderId(null);
                          }}
                          onBlur={() => saveFolderRename(folder.id)}
                          style={{
                            backgroundColor: 'var(--bg-color)',
                            color: 'var(--text-color)',
                            border: '1px solid var(--accent-color)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '2px 4px',
                            fontSize: '11px',
                            outline: 'none',
                            width: '100%'
                          }}
                          autoFocus
                        />
                      ) : (
                        <>
                          <span
                            style={{
                              fontSize: '11.5px',
                              fontWeight: '600',
                              color: 'var(--accent-color)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '120px'
                        }}
                            title={folder.name}
                          >
                            📁 {renderHighlightedText(folder.name, searchQuery)}
                          </span>
                          
                          {/* Folder Actions Menu */}
                          <div style={{ position: 'relative' }}>
                            <button
                              onClick={(e) => toggleMenu(e, `folder-${folder.id}`)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}
                            >
                              ⋮
                            </button>
                            {activeMenuId === `folder-${folder.id}` && (
                              <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '18px',
                                backgroundColor: 'var(--card-color)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-md)',
                                zIndex: 10,
                                minWidth: '120px',
                                padding: '4px 0'
                              }}>
                                <button onClick={(e) => startFolderRename(e, folder)} style={{ display: 'block', width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--text-color)', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>✏️ {getTranslation('renameFolder', language)}</button>
                                <button onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }} style={{ display: 'block', width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--danger-color)', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>🗑️ {getTranslation('deleteFolder', language)}</button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Chats in Folder */}
                    <ul className="history-list">
                      {folderChats.map((chat) => (
                        <li key={chat.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
                          {editingChatId === chat.id ? (
                            <input
                              value={editingChatValue}
                              onChange={(e) => setEditingChatValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveChatRename(chat.id);
                                if (e.key === 'Escape') setEditingChatId(null);
                              }}
                              onBlur={() => saveChatRename(chat.id)}
                              style={{
                                backgroundColor: 'var(--bg-color)',
                                color: 'var(--text-color)',
                                border: '1px solid var(--accent-color)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '2px 4px',
                                fontSize: '12px',
                                outline: 'none',
                                width: '100%'
                              }}
                              autoFocus
                            />
                          ) : (
                            <>
                              <button
                                className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                                onClick={() => onSelectChat(chat.id)}
                                style={{ flex: 1, padding: '4px 6px', fontSize: '12px', overflow: 'hidden' }}
                              >
                                <span>📄</span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {renderHighlightedText(chat.title, searchQuery)}
                                </span>
                              </button>

                              {/* Chat Menu button inside folder */}
                              <div style={{ position: 'relative' }}>
                                <button
                                  onClick={(e) => toggleMenu(e, `chat-${chat.id}`)}
                                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', fontSize: '12px' }}
                                >
                                  ⋮
                                </button>
                                {activeMenuId === `chat-${chat.id}` && (
                                  <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '20px',
                                    backgroundColor: 'var(--card-color)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-md)',
                                    zIndex: 10,
                                    minWidth: '120px',
                                    padding: '4px 0'
                                  }}>
                                    {renderChatMenu(chat)}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                      {folderChats.length === 0 && (
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '2px 6px' }}>
                          {getTranslation('noMatchingLogs', language)}
                        </div>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favoriteChats.length > 0 && (
          <div>
            <div className="history-title">⭐ {getTranslation('favorites', language)}</div>
            <ul className="history-list">
              {favoriteChats.map((chat) => (
                <li key={chat.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
                  {editingChatId === chat.id ? (
                    <input
                      value={editingChatValue}
                      onChange={(e) => setEditingChatValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveChatRename(chat.id);
                        if (e.key === 'Escape') setEditingChatId(null);
                      }}
                      onBlur={() => saveChatRename(chat.id)}
                      style={{
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--accent-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 6px',
                        fontSize: '12px',
                        outline: 'none',
                        width: '100%'
                      }}
                      autoFocus
                    />
                  ) : (
                    <>
                      <button
                        className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                        onClick={() => onSelectChat(chat.id)}
                        style={{ flex: 1, overflow: 'hidden' }}
                      >
                        <span>⭐</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {renderHighlightedText(chat.title, searchQuery)}
                        </span>
                      </button>

                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={(e) => toggleMenu(e, `chat-${chat.id}`)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px', fontSize: '14px' }}
                        >
                          ⋮
                        </button>
                        {activeMenuId === `chat-${chat.id}` && (
                          <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '24px',
                            backgroundColor: 'var(--card-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 10,
                            minWidth: '120px',
                            padding: '4px 0'
                          }}>
                            {renderChatMenu(chat)}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent Section */}
        {recentChats.length > 0 && (
          <div>
            <div className="history-title">{getTranslation('recentChats', language)}</div>
            <ul className="history-list">
              {recentChats.map((chat) => (
                <li key={chat.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
                  {editingChatId === chat.id ? (
                    <input
                      value={editingChatValue}
                      onChange={(e) => setEditingChatValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveChatRename(chat.id);
                        if (e.key === 'Escape') setEditingChatId(null);
                      }}
                      onBlur={() => saveChatRename(chat.id)}
                      style={{
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--accent-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 6px',
                        fontSize: '12px',
                        outline: 'none',
                        width: '100%'
                      }}
                      autoFocus
                    />
                  ) : (
                    <>
                      <button
                        className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                        onClick={() => onSelectChat(chat.id)}
                        style={{ flex: 1, overflow: 'hidden' }}
                      >
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
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {renderHighlightedText(chat.title, searchQuery)}
                        </span>
                      </button>

                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={(e) => toggleMenu(e, `chat-${chat.id}`)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px', fontSize: '14px' }}
                        >
                          ⋮
                        </button>
                        {activeMenuId === `chat-${chat.id}` && (
                          <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '24px',
                            backgroundColor: 'var(--card-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 10,
                            minWidth: '120px',
                            padding: '4px 0'
                          }}>
                            {renderChatMenu(chat)}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Archived Section */}
        {filteredArchivedChats.length > 0 && (
          <div>
            <div className="history-title">📦 {getTranslation('archive', language)}</div>
            <ul className="history-list">
              {filteredArchivedChats.map((chat) => (
                <li key={chat.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
                  {editingChatId === chat.id ? (
                    <input
                      value={editingChatValue}
                      onChange={(e) => setEditingChatValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveChatRename(chat.id);
                        if (e.key === 'Escape') setEditingChatId(null);
                      }}
                      onBlur={() => saveChatRename(chat.id)}
                      style={{
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--accent-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 6px',
                        fontSize: '12px',
                        outline: 'none',
                        width: '100%'
                      }}
                      autoFocus
                    />
                  ) : (
                    <>
                      <button
                        className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                        onClick={() => onSelectChat(chat.id)}
                        style={{ flex: 1, overflow: 'hidden', opacity: 0.6 }}
                      >
                        <span>📦</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {renderHighlightedText(chat.title, searchQuery)}
                        </span>
                      </button>

                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={(e) => toggleMenu(e, `chat-${chat.id}`)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px', fontSize: '14px' }}
                        >
                          ⋮
                        </button>
                        {activeMenuId === `chat-${chat.id}` && (
                          <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '24px',
                            backgroundColor: 'var(--card-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 10,
                            minWidth: '120px',
                            padding: '4px 0'
                          }}>
                            {renderChatMenu(chat)}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Security status footer */}
      <div className="sidebar-status">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>{getTranslation('systemSecure', language)}</span>
        </div>
        <div style={{ fontSize: '9px', fontFamily: 'monospace', opacity: 0.6 }}>
          WKSP_ACTIVE
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
