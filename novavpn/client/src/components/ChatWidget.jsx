import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendChatMessage, subscribeToChat } from '../services/chatService';
import { postChatWebhook } from '../services/webhookService';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToChat(user.uid, (msgs) => {
      setMessages(msgs);
      if (!open) {
        const newUnread = msgs.filter(m => m.sender === 'admin' && !m.read).length;
        setUnread(newUnread);
      }
    });
    return unsub;
  }, [user, open]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [open, messages]);

  const handleSend = async () => {
    if (!text.trim() || !user) return;
    setSending(true);
    const msgText = text.trim();
    setText('');
    try {
      await sendChatMessage(user.uid, msgText, 'user');
      await postChatWebhook({
        username: user.displayName || user.email,
        message: msgText,
        uid: user.uid,
      });
    } catch (err) {
      console.error('Chat send error:', err);
    }
    setSending(false);
  };

  if (!user) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: 52, height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
          zIndex: 998,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? <X size={20} color="#fff" /> : <MessageCircle size={20} color="#fff" />}
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#f472b6',
            borderRadius: '50%', width: 18, height: 18,
            fontSize: '10px', fontWeight: 700, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{unread}</span>
        )}
      </button>

      {/* Chat drawer */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '88px', right: '24px',
          width: 'min(360px, calc(100vw - 32px))',
          height: '480px',
          borderRadius: '20px',
          background: 'rgba(10,10,26,0.95)',
          border: '1px solid rgba(124,58,237,0.3)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          zIndex: 997,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(124,58,237,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#34d399',
                boxShadow: '0 0 6px #34d399',
              }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>Admin Support</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '60px', color: '#475569', fontSize: '13px' }}>
                <MessageCircle size={28} style={{ marginBottom: '8px', opacity: 0.3 }} />
                <p>Send a message to start chatting with support</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} style={{
                display: 'flex',
                justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.sender === 'user'
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(6,182,212,0.4))'
                    : 'rgba(255,255,255,0.06)',
                  border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  fontSize: '13px',
                  color: '#f1f5f9',
                  lineHeight: 1.5,
                }}>
                  {m.text}
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px', textAlign: 'right' }}>
                    {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', gap: '8px',
          }}>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type a message..."
              style={{
                flex: 1, padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#f1f5f9',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              style={{
                width: 38, height: 38, borderRadius: '10px',
                background: text.trim() ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.06)',
                border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
