
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';
import geminiService from '../services/geminiService';
import './AIAssistant.css';

const AIAssistant = () => {
  const { user } = useAuth();
  
  const getWelcomeMessage = () => {
    if (user) {
      return `👋 Hello ${user.name}! I'm Peer Ai, your AI travel assistant. I'm here to help you plan the perfect Kenyan adventure! Ask me about safaris, beaches, cultural experiences, or anything else about traveling in Kenya.`;
    }
    return "👋 Hello! I'm Peer Ai, your AI travel assistant. I'm here to help you plan the perfect Kenyan adventure! Ask me about safaris, beaches, cultural experiences, or anything else about traveling in Kenya.";
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Get chat history for context
      const chatHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await geminiService.sendMessage(userMessage.content, chatHistory, user);
      
      setIsTyping(false);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.success ? response.message : response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickResponse = (response) => {
    setInputMessage(response);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date()
      }
    ]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-page">
      <Navbar activeRoute="/ai-assistant" />
      
      <div className="ai-container">
        <div className="ai-header">
          <div className="ai-title">
            <div className="ai-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="ai-info">
              <h1>Peer Ai</h1>
              <p>Your AI Travel Assistant</p>
            </div>
          </div>
          <button className="clear-chat-btn" onClick={clearChat} title="Clear conversation">
            <i className="fas fa-trash"></i>
          </button>
        </div>

        <div className="chat-container">
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'assistant' ? (
                    <i className="fas fa-robot"></i>
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {message.role === 'assistant' ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                  <div className="message-time">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message assistant">
                <div className="message-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-section">
            {messages.length <= 1 && (
              <div className="quick-responses">
                <p>Quick questions to get started:</p>
                <div className="quick-response-buttons">
                  {geminiService.getQuickResponses().map((response, index) => (
                    <button
                      key={index}
                      className="quick-response-btn"
                      onClick={() => handleQuickResponse(response)}
                    >
                      {response}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="input-container">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about traveling in Kenya..."
                rows="1"
                disabled={isLoading}
                className="message-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="send-button"
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIAssistant;
