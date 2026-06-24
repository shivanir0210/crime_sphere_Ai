import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { sendMessage } from '../services/chatbotApi';

/**
 * Chatbot Page Component.
 * Orchestrates the full layout: handles active chat sessions,
 * sends messages, triggers loader states, and updates chat histories.
 */
function Chatbot() {
  // Get current timestamp formatted as HH:MM AM/PM
  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Initial investigation thread
  const defaultChatId = 'case-scan-bengaluru';
  
  // State for all chat sessions
  const [chatHistory, setChatHistory] = useState([
    {
      id: defaultChatId,
      title: 'Bengaluru Offender Scan',
      messages: [
        {
          id: 'init-msg-1',
          sender: 'bot',
          text: 'Welcome to CrimeSphere AI. How can I assist your investigation today?',
          timestamp: '10:00 AM'
        }
      ]
    },
    {
      id: 'case-network-suspects',
      title: 'Suspect Network Analysis',
      messages: [
        {
          id: 'init-msg-2',
          sender: 'bot',
          text: 'Welcome to CrimeSphere AI. How can I assist your investigation today?',
          timestamp: '09:15 AM'
        },
        {
          id: 'user-msg-2',
          sender: 'user',
          text: 'Show recent suspect networks.',
          timestamp: '09:16 AM'
        },
        {
          id: 'bot-msg-2',
          sender: 'bot',
          text: 'Scanning records... Found 1 central suspect node connected to 4 sub-offenders.',
          timestamp: '09:17 AM'
        }
      ]
    }
  ]);

  // State to track which chat session is active
  const [activeChatId, setActiveChatId] = useState(defaultChatId);
  
  // State for indicating whether the chatbot is analyzing/typing
  const [isTyping, setIsTyping] = useState(false);

  // Retrieve active chat messages
  const activeChat = chatHistory.find((chat) => chat.id === activeChatId) || chatHistory[0];
  const messages = activeChat ? activeChat.messages : [];

  // Handler to select another investigation session
  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  // Handler to create a new chat session
  const handleNewChat = () => {
    const newId = `case-${Date.now()}`;
    const newChatSession = {
      id: newId,
      title: 'New Case Investigation',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: 'Welcome to CrimeSphere AI. How can I assist your investigation today?',
          timestamp: getFormattedTime()
        }
      ]
    };
    
    setChatHistory([newChatSession, ...chatHistory]);
    setActiveChatId(newId);
  };

  // Handler to send a message
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Create user message object
    const userMessageId = `user-msg-${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      sender: 'user',
      text: text,
      timestamp: getFormattedTime()
    };

    // Update active chat's messages locally
    let updatedHistory = chatHistory.map((chat) => {
      if (chat.id === activeChatId) {
        // If the title is generic, update it to match the first user question
        const title = chat.title === 'New Case Investigation' 
          ? (text.length > 25 ? text.substring(0, 25) + '...' : text) 
          : chat.title;
          
        return {
          ...chat,
          title,
          messages: [...chat.messages, userMessage]
        };
      }
      return chat;
    });

    setChatHistory(updatedHistory);
    setIsTyping(true);

    try {
      // Send message to the mock API
      const result = await sendMessage(text);
      
      const botMessageId = `bot-msg-${Date.now()}`;
      const botMessage = {
        id: botMessageId,
        sender: 'bot',
        text: result.response,
        timestamp: getFormattedTime()
      };

      // Add bot response to message list
      setChatHistory((prevHistory) =>
        prevHistory.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, botMessage]
            };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: `err-msg-${Date.now()}`,
        sender: 'bot',
        text: 'Failed to communicate with intelligence stream. Please try again.',
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

  return (
    <div className="chatbot-container">
      {/* Left Sidebar */}
      <Sidebar
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <ChatWindow
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default Chatbot;
