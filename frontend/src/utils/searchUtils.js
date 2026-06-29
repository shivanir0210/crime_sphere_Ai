/**
 * Search Utilities - Phase 3.
 * Pure JavaScript utility file. Does not contain JSX.
 */

/**
 * Filters chats based on search query matching title, tags, or message logs,
 * and tag filtering.
 */
export const searchChats = (chats = [], query = '', selectedTag = '') => {
  const q = query.toLowerCase().trim();
  
  return chats.filter((chat) => {
    const matchesSearch =
      q === '' ||
      chat.title.toLowerCase().includes(q) ||
      (chat.tags && chat.tags.some((tag) => tag.toLowerCase().includes(q))) ||
      (chat.messages && chat.messages.some((m) => m.text.toLowerCase().includes(q)));

    const matchesTag =
      !selectedTag || (chat.tags && chat.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });
};

/**
 * Filters folders based on whether the folder name matches the query,
 * or it contains chats matching the search queries.
 */
export const searchFolders = (folders = [], chats = [], query = '', selectedTag = '') => {
  const q = query.toLowerCase().trim();
  const filteredChatIds = searchChats(chats, query, selectedTag).map((c) => c.id);

  return folders.filter((folder) => {
    if (q === '') return true;

    const matchesFolderName = folder.name.toLowerCase().includes(q);
    const hasFilteredChats =
      folder.chatIds && folder.chatIds.some((chatId) => filteredChatIds.includes(chatId));

    return matchesFolderName || hasFilteredChats;
  });
};

/**
 * Splits text into highlighted and normal segments.
 * Returns an array of objects: { text: string, highlight: boolean }
 */
export const getHighlightParts = (text = '', query = '') => {
  if (!query || !query.trim()) {
    return [{ text, highlight: false }];
  }

  const q = query.trim().toLowerCase();
  const escapedQuery = query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part) => ({
    text: part,
    highlight: part.toLowerCase() === q
  }));
};
