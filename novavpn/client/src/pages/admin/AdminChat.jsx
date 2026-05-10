import { useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { subscribeToAllChats, sendChatMessage, markMessagesRead } from '../../services/chatService';
import { postChatWebhook } from '../../services/webhookService';
import { Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminChat() {
  const [allChats, setAllChats] = useState({});
  const [users, setUsers] = useState({});
  const [selectedUid, setSelectedUid] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    getDocs(collection(db, 'users')).then(snap => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = { uid: d.id, ...d.data() }; });
      setUsers(map);
    });
  }, []);

  useEffect(() => {
    const unsub = subscribeToAllChats(chats => {
      setAllChats(chats);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (selectedUid) {
      markMessagesRead(selectedUid);
      setTimeout(() => bottomRef.current && bottomRef.current.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [selectedUid, allChats]);

  const handleSend = async () => {
    if (!reply.trim() || !selectedUid) return;
    setSending(true);
    const text = reply.trim();
    setReply('');
    try {
      await sendChatMessage(selectedUid, text, 'admin');
    } catch (err) {
      console.error('Admin send error:', err);
    }
    setSending(false);
  };

  const conversations = Object.keys(allChats).sort((a, b) => {
    const aLast = allChats[a].slice(-1)[0];
    const bLast = allChats[b].slice(-1)[0];
    return (bLast ? bLast.timestamp : 0) - (aLast ? aLast.timestamp : 0);
  });

  const getUnreadCount = (uid) => {
    return (allChats[uid] || []).filter(m => m.sender === 'user' && !m.read).length;
  };

  const selectedMessages = selectedUid ? (allChats[selectedUid] || []) : [];

  return (
    <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 120px)', minHeight: '500px' }}>
      {/* Sidebar - conversation list */}
      <div style={{ width: '260px', flexShrink: 0, background: 'rgba(10,10,26,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>
          Conversations
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
              <MessageSquare size={24} style={{ marginBottom: '8px', opacity: 0.3 }} />
              <p>No conversations yet</p>
            </div>
          ) : conversations.map(uid => {
            const u = users[uid];
            const msgs = allChats[uid] || [];
            const last = msgs.slice(-1)[0];
            const unread = getUnreadCount(uid);
            const isSelected = selectedUid === uid;
            return (
              <button key={uid} onClick={() => setSelectedUid(uid)} style={{ width: '100%', padding: '12px 16px', background: isSelected ? 'rgba(124,58,237,0.15)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderLeft: isSelected ? '3px solid #7c3aed' : '3px solid transparent', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {(u ? (u.displayName || u.email || '?') : uid)[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u ? (u.displayName || u.email?.split('@')[0]) : uid.slice(0, 8) + '...'}
                  </div>
                  {last && <div style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{last.text?.slice(0, 30)}</div>}
                </div>
                {unread > 0 && (
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#7c3aed', fontSize: '10px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{unread}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, background: 'rgba(10,10,26,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedUid ? (
          <>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                {(users[selectedUid] ? (users[selectedUid].displayName || users[selectedUid].email || '?') : selectedUid)[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{users[selectedUid] ? (users[selectedUid].displayName || users[selectedUid].email) : selectedUid}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{users[selectedUid] ? users[selectedUid].email : ''}</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedMessages.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: m.sender === 'admin' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.sender === 'admin' ? 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(6,182,212,0.4))' : 'rgba(255,255,255,0.06)', border: m.sender === 'admin' ? 'none' : '1px solid rgba(255,255,255,0.08)', fontSize: '13px', color: '#f1f5f9', lineHeight: 1.5 }}>
                    {m.text}
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px', textAlign: 'right' }}>
                      {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px' }}>
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Reply as admin..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '13px', outline: 'none' }}
              />
              <button onClick={handleSend} disabled={!reply.trim() || sending} style={{ width: 38, height: 38, borderRadius: '10px', background: reply.trim() ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.06)', border: 'none', cursor: reply.trim() ? 'pointer' : 'not-allowed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Send size={15} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#475569' }}>
            <MessageSquare size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px' }}>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
