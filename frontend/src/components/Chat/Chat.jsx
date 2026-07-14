import { useState, useCallback, useEffect } from 'react';
import { sendChatMessage } from '../../services/api';
import VoiceControls from '../VoiceControl/VoiceControl';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [textToSpeak, setTextToSpeak] = useState('');
  const [sessionId, setSessionId] = useState(null);

  // Generar sessionId al cargar
  useEffect(() => {
    const id = localStorage.getItem('pili_sessionId') || 
               `session_${Date.now()}`;
    localStorage.setItem('pili_sessionId', id);
    setSessionId(id);
  }, []);

  const handleTranscript = useCallback((transcript) => {
    setInput(transcript);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(userMessage, sessionId);
      setMessages(prev => [...prev, { role: 'bot', content: reply }]);
      setTextToSpeak(reply);
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>🌿 Pili Botánica</h1>
        <p>Tu asistente experta en plantas (Con BD)</p>
        <small style={{opacity: 0.7}}>ID: {sessionId?.slice(0, 8)}...</small>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.role === 'bot' && <span className="emoji">🌱</span>}
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && <div className="message bot"><p>Pili está pensando...</p></div>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe o usa 🎤..."
          disabled={loading}
        />
        <VoiceControls 
          onTranscript={handleTranscript}
          textToSpeak={textToSpeak}
          disabled={loading}
        />
        <button 
          onClick={sendMessage} 
          disabled={loading}
          className="send-btn"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}