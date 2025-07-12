import React, { useState, useEffect, useRef } from 'react';
import backendService from '../services/backendService';
import './AIAssistant.css';

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    async function loadContext() {
      const res = await backendService.getAIContext();
      if (res.success) {
        setContext(res.data);
        // preload chat history
        setMessages(res.data.chatHistory.map(h => ({ role: 'user', text: h.message })).concat(
          res.data.chatHistory.map(h => ({ role: 'assistant', text: h.response }))
        ));
      }
    }
    loadContext();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const toggleChat = () => setOpen(o => !o);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    // send to backend to save
    await backendService.saveChatHistory(context.userContext.id, input, '');
    // here, ideally you get AI response from external service
    const fakeResponse = 'Let me take care of that for you.';
    setMessages(msgs => [...msgs, { role: 'assistant', text: fakeResponse }]);
  };

  return (
    <div className="ai-assistant-container">
      {open && (
        <div className="ai-chat-window">
          <div className="ai-chat-header" onClick={toggleChat}>
            AI Assistant
          </div>
          <div className="ai-chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`ai-message ${m.role}`}>{m.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="ai-chat-input">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
      <button className="ai-fab" onClick={toggleChat}>AI</button>
    </div>
  );
};

export default AIAssistant;
