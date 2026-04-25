import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRealtimeCollection } from '../hooks/useFirestore';
import { addDocument } from '../firebase/firestore';

const ChatWidget = () => {
  const { currentUser, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // We fetch all messages and filter in client to avoid complex indexing for now,
  // or we can use a custom hook. useRealtimeCollection doesn't support complex where clauses out of the box in this app's implementation,
  // so we'll just filter them here.
  const { data: allMessages } = useRealtimeCollection('messages', []);
  
  const messages = (allMessages || [])
    .filter(m => m.uid === currentUser?.uid)
    .sort((a, b) => (a.createdAt?.toDate?.() || 0) - (b.createdAt?.toDate?.() || 0));

  const unreadCount = messages.filter(m => m.sender === 'admin' && !m.read && !isOpen).length;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      // In a real app, we would mark them as read here
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) return;
    
    const msgText = text;
    setText('');
    
    try {
      await addDocument('messages', {
        uid: currentUser.uid,
        userEmail: currentUser.email,
        userName: userData?.displayName || 'User',
        text: msgText,
        sender: 'client',
        read: false
      });
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[400px] mb-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-headset text-white text-sm"></i>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Support Chat</h3>
                <p className="text-[10px] text-cyan-100">We typically reply in a few minutes</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-950/50 flex flex-col gap-3">
            <div className="text-center">
              <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded-full">Chat Started</span>
            </div>
            {messages.map(msg => {
              const isMine = msg.sender === 'client';
              return (
                <div key={msg.id} className={`flex flex-col max-w-[80%] ${isMine ? 'self-end' : 'self-start'}`}>
                  <div className={`p-3 rounded-2xl text-sm ${isMine ? 'bg-cyan-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  <span className={`text-[9px] text-slate-500 mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                    {msg.createdAt?.toDate?.().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || 'Now'}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-slate-700 hover:bg-cyan-500 transition-colors"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center hover:scale-105 transition-transform relative"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'} text-xl`}></i>
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-slate-900 text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
