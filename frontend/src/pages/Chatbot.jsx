import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { sendMessage, analyzeDocument } from '../services/chatbotApi';
import { getStoredContext, storeContext, clearStoredContext, extractContext } from '../services/contextManager';
import { getFollowUpSuggestions } from '../services/assistantService';
import { getCurrentLanguage, detectLanguage, translateText, translateResponse } from '../services/languageService';
import { useLanguage } from '../context/LanguageContext';

/**
 * Chatbot Workspace Orchestrator Page - Phase 3.
 * Manages states, local storage sync, chat renaming, folder triggers,
 * search filters, and summaries.
 */
function Chatbot() {
  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to load chat histories from localStorage
  const loadInitialChats = () => {
    const saved = localStorage.getItem('crimesphere_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error loading localStorage chats:', e);
      }
    }
    
    // Default initial chats
    return [
      {
        id: 'case-scan-bengaluru',
        title: 'Repeat Offenders Scan',
        pinned: false,
        favorite: true,
        archived: false,
        tags: ['#Theft'],
        messages: [
          {
            id: 10001,
            text: 'Welcome to CrimeSphere AI. How can I assist your investigation today?',
            sender: 'bot',
            timestamp: '10:00 AM'
          }
        ]
      },
      {
        id: 'case-cyber-fraud',
        title: 'Cyber Fraud Analysis',
        pinned: true,
        favorite: false,
        archived: false,
        tags: ['#CyberCrime', '#Fraud'],
        messages: [
          {
            id: 10002,
            text: 'Welcome to CrimeSphere AI. How can I assist your investigation today?',
            sender: 'bot',
            timestamp: '09:30 AM'
          }
        ]
      }
    ];
  };

  // Helper to load folder configurations from localStorage
  const loadInitialFolders = () => {
    const saved = localStorage.getItem('crimesphere_folders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      } catch (e) {
        console.error('Error loading localStorage folders:', e);
      }
    }

    // Default folders structure
    return [
      { id: 'folder-cyber', name: 'Cyber Crime', chatIds: ['case-cyber-fraud'] },
      { id: 'folder-theft', name: 'Theft Cases', chatIds: ['case-scan-bengaluru'] }
    ];
  };

  // Helper to load active chat ID
  const loadInitialActiveChatId = (chats) => {
    const savedId = localStorage.getItem('crimesphere_active_chat_id');
    if (savedId && chats.some((chat) => chat.id === savedId)) {
      return savedId;
    }
    return chats[0]?.id || 'case-scan-bengaluru';
  };

  // State Management
  const [chatHistory, setChatHistory] = useState(loadInitialChats);
  const [folders, setFolders] = useState(loadInitialFolders);
  const [activeChatId, setActiveChatId] = useState(() => {
    const chats = loadInitialChats();
    return loadInitialActiveChatId(chats);
  });
  const [isTyping, setIsTyping] = useState(false);
  const [activeContext, setActiveContext] = useState(getStoredContext);
  const { language, setLanguage } = useLanguage();

  const lastTranslatedLanguageRef = useRef(language);

  // Sync / translate whole chat history when language selection changes
  useEffect(() => {
    const translateHistory = async () => {
      if (language === lastTranslatedLanguageRef.current) return;
      lastTranslatedLanguageRef.current = language;

      const targetLang = language;

      const updatedHistory = await Promise.all(
        chatHistory.map(async (chat) => {
          const activeLang = targetLang === 'auto'
            ? (chat.detectedLanguageCode || 'en')
            : targetLang;

          const updatedMessages = await Promise.all(
            chat.messages.map(async (msg) => {
              const englishText = msg.englishText || msg.text || '';
              const englishIntel = msg.englishIntel || msg.intelligenceData || null;
              const englishSuggestions = msg.englishSuggestions || msg.suggestions || [];
              const englishAnalysis = msg.englishAnalysis || msg.analysis || null;

              const translatedText = await translateResponse(englishText, activeLang);

              let translatedIntel = null;
              if (englishIntel) {
                const translatedSummary = await translateResponse(englishIntel.summary, activeLang);
                const translatedReasoning = await Promise.all(
                  (englishIntel.reasoning || []).map((r) => translateResponse(r, activeLang))
                );
                const translatedRecommendations = await Promise.all(
                  (englishIntel.recommendations || []).map((r) => translateResponse(r, activeLang))
                );
                const translatedHotspots = await Promise.all(
                  (englishIntel.hotspots || []).map(async (h) => ({
                    ...h,
                    location: await translateResponse(h.location, activeLang),
                    risk: await translateResponse(h.risk, activeLang)
                  }))
                );
                const translatedNetwork = await Promise.all(
                  (englishIntel.network || []).map(async (n) => ({
                    ...n,
                    from: await translateResponse(n.from, activeLang),
                    relation: await translateResponse(n.relation, activeLang),
                    to: await translateResponse(n.to, activeLang)
                  }))
                );
                const translatedSimilarCases = await Promise.all(
                  (englishIntel.similarCases || []).map(async (c) => ({
                    ...c,
                    title: await translateResponse(c.title, activeLang)
                  }))
                );

                translatedIntel = {
                  ...englishIntel,
                  summary: translatedSummary,
                  reasoning: translatedReasoning,
                  recommendations: translatedRecommendations,
                  hotspots: translatedHotspots,
                  network: translatedNetwork,
                  similarCases: translatedSimilarCases
                };
              }

              const translatedSuggestions = await Promise.all(
                (englishSuggestions || []).map((s) => translateResponse(s, activeLang))
              );

              let translatedAnalysis = null;
              if (englishAnalysis) {
                const translatedCrimeType = await translateResponse(englishAnalysis.crimeType, activeLang);
                const translatedRiskLevel = await translateResponse(englishAnalysis.riskLevel, activeLang);
                const translatedLocations = await Promise.all(
                  (englishAnalysis.locations || []).map((loc) => translateResponse(loc, activeLang))
                );
                translatedAnalysis = {
                  ...englishAnalysis,
                  crimeType: translatedCrimeType,
                  riskLevel: translatedRiskLevel,
                  locations: translatedLocations
                };
              }

              return {
                ...msg,
                text: translatedText,
                englishText,
                intelligenceData: translatedIntel,
                englishIntel,
                suggestions: translatedSuggestions,
                englishSuggestions,
                ...(englishAnalysis ? {
                  analysis: translatedAnalysis,
                  englishAnalysis
                } : {})
              };
            })
          );

          return {
            ...chat,
            messages: updatedMessages
          };
        })
      );

      setChatHistory(updatedHistory);
    };

    translateHistory();
  }, [language, chatHistory]);

  // Sync activeContext with localStorage
  useEffect(() => {
    storeContext(activeContext);
  }, [activeContext]);

  // Clear Context handler
  const handleClearContext = () => {
    const cleared = clearStoredContext();
    setActiveContext(cleared);
  };

  // Search & Tag Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('crimesphere_chats', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('crimesphere_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('crimesphere_active_chat_id', activeChatId);
  }, [activeChatId]);

  // Extract active conversation details
  const activeChat = chatHistory.find((chat) => chat.id === activeChatId) || chatHistory[0];
  const messages = activeChat ? activeChat.messages : [];
  const activeChatIsPinned = activeChat ? !!activeChat.pinned : false;
  const activeChatTitle = activeChat ? activeChat.title : 'Investigation';
  const activeChatIsFavorite = activeChat ? !!activeChat.favorite : false;
  const activeChatIsArchived = activeChat ? !!activeChat.archived : false;
  const activeChatTags = activeChat ? activeChat.tags || [] : [];
  const langNames = {
    en: 'English',
    kn: 'Kannada',
    hi: 'Hindi',
    ta: 'Tamil',
    te: 'Telugu',
    ml: 'Malayalam',
    mr: 'Marathi',
    bn: 'Bengali',
    gu: 'Gujarati',
    pa: 'Punjabi',
    ur: 'Urdu'
  };
  const activeChatLang = activeChat ? activeChat.detectedLanguage || 'English' : 'English';
  const detectedLanguage = language === 'auto' ? activeChatLang : (langNames[language] || 'English');

  // Toggle active chat selection
  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  // Create a brand new case session
  const handleNewChat = () => {
    const newId = `case-${Date.now()}`;
    const freshChat = {
      id: newId,
      title: 'New Case Investigation',
      pinned: false,
      favorite: false,
      archived: false,
      tags: [],
      detectedLanguage: 'English',
      messages: [
        {
          id: Date.now(),
          text: 'Welcome to CrimeSphere AI. How can I assist your investigation today?',
          sender: 'bot',
          timestamp: getFormattedTime()
        }
      ]
    };

    setChatHistory([freshChat, ...chatHistory]);
    setActiveChatId(newId);
  };

  // Folder CRUD: Create Folder
  const handleNewFolder = () => {
    const name = prompt('Enter new folder name:');
    if (!name || !name.trim()) return;

    const newFolder = {
      id: `folder-${Date.now()}`,
      name: name.trim(),
      chatIds: []
    };

    setFolders([...folders, newFolder]);
  };

  // Folder CRUD: Rename Folder
  const handleRenameFolder = (folderId, newName) => {
    setFolders(
      folders.map((f) => (f.id === folderId ? { ...f, name: newName } : f))
    );
  };

  // Folder CRUD: Delete Folder (preserve chats)
  const handleDeleteFolder = (folderId) => {
    if (confirm('Are you sure you want to delete this folder? (Chats inside will be preserved)')) {
      setFolders(folders.filter((f) => f.id !== folderId));
    }
  };

  // Chat Rename
  const handleRenameChat = (chatId, newTitle) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat))
    );
  };

  // Pin/Unpin Toggle
  const handleTogglePinChat = (chatId) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat))
    );
  };

  // Favorite Toggle
  const handleToggleFavoriteChat = (chatId) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, favorite: !chat.favorite } : chat))
    );
  };

  // Archive Toggle
  const handleToggleArchiveChat = (chatId) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, archived: !chat.archived } : chat))
    );
  };

  // Move a chat between folders
  const handleMoveChatToFolder = (chatId, folderId) => {
    let updatedFolders = folders.map((f) => ({
      ...f,
      chatIds: (f.chatIds || []).filter((id) => id !== chatId)
    }));

    if (folderId) {
      updatedFolders = updatedFolders.map((f) => {
        if (f.id === folderId) {
          return {
            ...f,
            chatIds: [...(f.chatIds || []), chatId]
          };
        }
        return f;
      });
    }

    setFolders(updatedFolders);
  };

  // Add Tag to Case File
  const handleAddTag = (chatId, tagToAdd) => {
    setChatHistory((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const currentTags = chat.tags || [];
          if (currentTags.includes(tagToAdd)) return chat;
          return {
            ...chat,
            tags: [...currentTags, tagToAdd]
          };
        }
        return chat;
      })
    );
  };

  // Remove Tag from Case File
  const handleRemoveTag = (chatId, tagToRemove) => {
    setChatHistory((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            tags: (chat.tags || []).filter((t) => t !== tagToRemove)
          };
        }
        return chat;
      })
    );
  };

  // Case Summary Generation Handler
  const handleGenerateSummary = () => {
    if (!activeChat) return;

    const topicName = activeChat.title;
    const summaryText = `📋 **Investigation Summary**
    
**Topic:**
${topicName}

**Findings:**
* 3 repeat offenders identified
* Linked across Bengaluru and Mysuru
* Common crime pattern detected

**Risk Level:**
Medium`;

    const botSummaryMsg = {
      id: Date.now(),
      text: summaryText,
      sender: 'bot',
      timestamp: getFormattedTime()
    };

    setChatHistory((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, botSummaryMsg]
          };
        }
        return chat;
      })
    );
  };

  // Delete chat completely
  const handleDeleteChat = (chatId) => {
    if (confirm('Are you sure you want to delete this investigation?')) {
      const updatedHistory = chatHistory.filter((chat) => chat.id !== chatId);

      // Clean up folders
      const updatedFolders = folders.map((f) => ({
        ...f,
        chatIds: (f.chatIds || []).filter((id) => id !== chatId)
      }));
      setFolders(updatedFolders);

      if (updatedHistory.length === 0) {
        // Re-create a clean session if all are deleted
        const newId = `case-${Date.now()}`;
        const freshChat = {
          id: newId,
          title: 'New Case Investigation',
          pinned: false,
          favorite: false,
          archived: false,
          tags: [],
          messages: [
            {
              id: Date.now(),
              text: 'Welcome to CrimeSphere AI. How can I assist your investigation today?',
              sender: 'bot',
              timestamp: getFormattedTime()
            }
          ]
        };
        setChatHistory([freshChat]);
        setActiveChatId(newId);
      } else {
        setChatHistory(updatedHistory);
        if (activeChatId === chatId) {
          setActiveChatId(updatedHistory[0].id);
        }
      }
    }
  };

  // Clear current active conversation session only (delegates to delete)
  const handleClearCurrentChat = () => {
    handleDeleteChat(activeChatId);
  };

  // Smart title parser from first user query keyword
  const getTitleFromMessage = (text) => {
    const query = text.toLowerCase();
    let initialTag = '';
    if (query.includes('repeat offender') || query.includes('theft')) {
      initialTag = '#Theft';
    } else if (query.includes('cybercrime')) {
      initialTag = '#CyberCrime';
    } else if (query.includes('fraud')) {
      initialTag = '#Fraud';
    } else if (query.includes('hotspot')) {
      initialTag = '#Hotspots';
    }

    if (query.includes('repeat offender')) {
      return { title: 'Repeat Offenders Investigation', tag: initialTag };
    } else if (query.includes('crime hotspot')) {
      return { title: 'Crime Hotspots Mapping', tag: initialTag };
    } else if (query.includes('cybercrime')) {
      return { title: 'Cybercrime Trend Study', tag: initialTag };
    } else if (query.includes('criminal network')) {
      return { title: 'Criminal Network Scan', tag: initialTag };
    } else if (query.includes('financial fraud')) {
      return { title: 'Financial Fraud Audit', tag: initialTag };
    } else {
      const cleaned = text.replace(/[🔍📍📊👥]/gu, '').trim();
      const truncated = cleaned.length > 20 ? cleaned.substring(0, 17) + '...' : cleaned;
      return { title: `${truncated} Investigation`, tag: initialTag };
    }
  };

  // Message dispatcher
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Detect user input language automatically
    const detectedLang = detectLanguage(text);
    const activeLang = language === 'auto' ? detectedLang : language;
    
    // Map the language code to the language name to update the header
    const langNames = {
      en: 'English',
      hi: 'Hindi',
      kn: 'Kannada',
      ta: 'Tamil',
      te: 'Telugu',
      ml: 'Malayalam',
      mr: 'Marathi',
      bn: 'Bengali',
      gu: 'Gujarati',
      pa: 'Punjabi',
      ur: 'Urdu'
    };
    const activeLangName = langNames[activeLang] || 'English';

    // Translate incoming foreign query to English for matching in crimeQueryEngine
    const englishQuery = await translateText(text, 'en');

    // Extract new context details from the English query
    const nextContext = extractContext(englishQuery, activeContext);
    setActiveContext(nextContext);

    const userMessage = {
      id: Date.now(),
      text: text, // Show original text in UI
      englishText: englishQuery, // Store the English query
      sender: 'user',
      timestamp: getFormattedTime()
    };

    setChatHistory((prevHistory) =>
      prevHistory.map((chat) => {
        if (chat.id === activeChatId) {
          let updatedTitle = chat.title;
          let updatedTags = chat.tags || [];

          if (chat.title === 'New Case Investigation' || chat.title === 'Chat 1') {
            const result = getTitleFromMessage(englishQuery);
            updatedTitle = result.title;
            if (result.tag && !updatedTags.includes(result.tag)) {
              updatedTags = [...updatedTags, result.tag];
            }
          }
          return {
            ...chat,
            title: updatedTitle,
            tags: updatedTags,
            detectedLanguage: activeLangName,
            messages: [...chat.messages, userMessage]
          };
        }
        return chat;
      })
    );

    setIsTyping(true);

    try {
      // Pass activeLang to sendMessage - it will return already translated results and English originals
      const result = await sendMessage(englishQuery, nextContext, activeLang);
      
      // Pass activeLang to getFollowUpSuggestions to get translated suggestions
      const suggestions = await getFollowUpSuggestions(englishQuery, result.intelligenceData, activeLang);
      const englishSuggestions = await getFollowUpSuggestions(englishQuery, result.englishIntelligenceData, 'en');

      const botMessage = {
        id: Date.now() + 1,
        text: result.response,
        englishText: result.englishResponse,
        sender: 'bot',
        timestamp: getFormattedTime(),
        intelligenceData: result.intelligenceData,
        englishIntel: result.englishIntelligenceData,
        suggestions: suggestions,
        englishSuggestions: englishSuggestions
      };

      setChatHistory((prevHistory) =>
          prevHistory.map((chat) => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                detectedLanguage: activeLangName,
                messages: [...chat.messages, botMessage]
              };
            }
            return chat;
          })
      );
    } catch (error) {
      console.error('Error fetching response:', error);
      const translatedError = await translateResponse('Error scanning database registries. Connection timed out.', detectedLang);
      const errorMessage = {
        id: Date.now() + 2,
        text: translatedError,
        sender: 'bot',
        timestamp: getFormattedTime()
      };

      setChatHistory((prevHistory) =>
        prevHistory.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage]
            };
          }
          return chat;
        })
      );
    } finally {
      setIsTyping(false);
    }
  };

  // FIR & Document Upload handler
  const handleUploadDocument = async (docData) => {
    // Extract context details from document name
    const nextContext = extractContext(docData.name, activeContext);
    setActiveContext(nextContext);

    const userDocMessage = {
      id: Date.now(),
      sender: 'user',
      timestamp: docData.time,
      document: docData
    };

    // Add user document message to chat history
    setChatHistory((prevHistory) =>
      prevHistory.map((chat) => {
        if (chat.id === activeChatId) {
          let updatedTitle = chat.title;
          if (chat.title === 'New Case Investigation' || chat.title === 'Chat 1') {
            updatedTitle = `Doc: ${docData.name}`;
          }
          return {
            ...chat,
            title: updatedTitle,
            messages: [...chat.messages, userDocMessage]
          };
        }
        return chat;
      })
    );

    setIsTyping(true);

    try {
      const activeLang = language === 'auto' ? detectLanguage(docData.name) : language;
      const langNames = {
        en: 'English', hi: 'Hindi', kn: 'Kannada', ta: 'Tamil', te: 'Telugu',
        ml: 'Malayalam', mr: 'Marathi', bn: 'Bengali', gu: 'Gujarati', pa: 'Punjabi', ur: 'Urdu'
      };
      const activeLangName = langNames[activeLang] || 'English';

      // Call the real backend endpoint via chatbotApi
      const result = await analyzeDocument(docData.rawFile, activeLang);

      if (!result.success) {
        let errText = "Document analysis failed.";
        if (result.error && (result.error.includes("Failed to fetch") || result.error.includes("unavailable") || result.error.includes("HTTP error"))) {
          errText = "CrimeSphere AI Service is unavailable.";
        }
        
        const translatedErr = await translateResponse(errText, activeLang);
        const botErrorMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          timestamp: getFormattedTime(),
          text: translatedErr,
          englishText: errText
        };

        setChatHistory((prevHistory) =>
          prevHistory.map((chat) => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                messages: [...chat.messages, botErrorMessage]
              };
            }
            return chat;
          })
        );
        return;
      }

      // Handle non-crime document case
      if (result.crimeDetected === false) {
        const botAnalysisMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          timestamp: getFormattedTime(),
          text: result.response,
          englishText: result.englishResponse,
          analysis: {
            documentName: docData.name,
            crimeType: await translateResponse("No crime-related information found in this document.", activeLang),
            victims: 0,
            suspects: 0,
            riskLevel: await translateResponse("None", activeLang),
            locations: [],
            crimeDetected: false
          },
          englishAnalysis: {
            documentName: docData.name,
            crimeType: "No crime-related information found in this document.",
            victims: 0,
            suspects: 0,
            riskLevel: "None",
            locations: [],
            crimeDetected: false
          },
          suggestions: [],
          englishSuggestions: []
        };

        setChatHistory((prevHistory) =>
          prevHistory.map((chat) => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                detectedLanguage: activeLangName,
                messages: [...chat.messages, botAnalysisMessage]
              };
            }
            return chat;
          })
        );
        return;
      }

      // Handle positive crime document analysis
      const suggestions = await getFollowUpSuggestions(docData.name, result.englishIntelligenceData, 'en');
      const translatedSuggestions = await Promise.all(
        (suggestions || []).map((s) => translateResponse(s, activeLang))
      );

      const botAnalysisMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        timestamp: getFormattedTime(),
        text: result.response,
        englishText: result.englishResponse,
        analysis: {
          documentName: docData.name,
          crimeType: result.intelligenceData.reasoning.find(r => r.includes("Crime Category:"))?.split(": ")[1] || result.rawAnalysis.crimeType,
          victims: result.rawAnalysis.victims,
          suspects: result.rawAnalysis.suspects,
          riskLevel: result.intelligenceData.hotspots[0]?.risk || result.rawAnalysis.riskLevel,
          locations: result.intelligenceData.hotspots.map(h => h.location)
        },
        englishAnalysis: {
          documentName: docData.name,
          crimeType: result.rawAnalysis.crimeType,
          victims: result.rawAnalysis.victims,
          suspects: result.rawAnalysis.suspects,
          riskLevel: result.rawAnalysis.riskLevel,
          locations: result.rawAnalysis.locations
        },
        intelligenceData: result.intelligenceData,
        englishIntel: result.englishIntelligenceData,
        suggestions: translatedSuggestions,
        englishSuggestions: suggestions
      };

      setChatHistory((prevHistory) =>
        prevHistory.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              detectedLanguage: activeLangName,
              messages: [...chat.messages, botAnalysisMessage]
            };
          }
          return chat;
        })
      );

    } catch (error) {
      console.error("Error in document analysis handler:", error);
      const translatedErr = await translateResponse("Document analysis failed.", language);
      const botErrorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        timestamp: getFormattedTime(),
        text: translatedErr,
        englishText: "Document analysis failed."
      };
      setChatHistory((prevHistory) =>
        prevHistory.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, botErrorMessage]
            };
          }
          return chat;
        })
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Search and Tag filtered Sidebar */}
      <Sidebar
        chatHistory={chatHistory}
        folders={folders}
        activeChatId={activeChatId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onNewFolder={handleNewFolder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
        onRenameChat={handleRenameChat}
        onTogglePinChat={handleTogglePinChat}
        onToggleFavoriteChat={handleToggleFavoriteChat}
        onToggleArchiveChat={handleToggleArchiveChat}
        onDeleteChat={handleDeleteChat}
        language={language}
      />

      {/* Case stream window */}
      <ChatWindow
        messages={messages}
        isTyping={isTyping}
        folders={folders}
        activeChatId={activeChatId}
        activeChatIsPinned={activeChatIsPinned}
        activeChatTitle={activeChatTitle}
        activeChatIsFavorite={activeChatIsFavorite}
        activeChatIsArchived={activeChatIsArchived}
        activeChatTags={activeChatTags}
        activeContext={activeContext}
        onClearContext={handleClearContext}
        onSendMessage={handleSendMessage}
        onUploadDocument={handleUploadDocument}
        onClearCurrentChat={handleClearCurrentChat}
        onTogglePinChat={handleTogglePinChat}
        onToggleFavoriteChat={handleToggleFavoriteChat}
        onToggleArchiveChat={handleToggleArchiveChat}
        onMoveChatToFolder={handleMoveChatToFolder}
        onGenerateSummary={handleGenerateSummary}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        language={language}
        onLanguageChange={setLanguage}
        detectedLanguage={detectedLanguage}
      />
    </div>
  );
}

export default Chatbot;
