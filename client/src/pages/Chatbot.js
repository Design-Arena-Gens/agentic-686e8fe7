import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 I am your Ayurvedic health guide. I can help you with food recommendations, dosha understanding, and natural remedies. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      text: input
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/chatbot/ask',
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = {
        sender: 'bot',
        text: response.data.message
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        sender: 'bot',
        text: 'I apologize, but I am having trouble responding right now. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'What foods help with diabetes?',
    'How can I improve my digestion?',
    'Tell me about my dosha',
    'What helps reduce stress?',
    'Foods for better immunity'
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="chatbot">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-avatar">🧘</div>
          <div className="chatbot-info">
            <h2>Ayurvedic Health Guide</h2>
            <p className="status">Online • Ready to help</p>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === 'bot' && (
                <div className="message-avatar">🧘</div>
              )}
              <div className="message-bubble">
                <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
              </div>
              {message.sender === 'user' && (
                <div className="message-avatar user-avatar">👤</div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message bot">
              <div className="message-avatar">🧘</div>
              <div className="message-bubble typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="quick-questions">
            <p className="quick-title">Quick questions you can ask:</p>
            <div className="quick-buttons">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  className="quick-btn"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chatbot-input-container">
          <textarea
            className="chatbot-input"
            placeholder="Ask me about Ayurvedic remedies, foods, or your health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="2"
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
