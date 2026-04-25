import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  initChat, 
  subscribeToMessages, 
  subscribeToClientUnread, 
  sendMessage, 
  markMessagesRead 
} from '../firebase/chatService';

const ChatWidget = () => {
  const { currentUser, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Initialize chat metadata when user logs in
  useEffect(() => {
    if (currentUser) {
      initChat(currentUser.uid, userData?.displayName, currentUser.email).catch(console.error);
    }
  }, [currentUser, userData]);

  // Subscribe to messages and unread count
  useEffect(() => {
    if (!currentUser) return;
    
    const unsubMessages = subscribeToMessages(currentUser.uid, (msgs) => {
      setMessages(msgs);
    });

    const unsubUnread = subscribeToClientUnread(currentUser.uid, (count) => {
      setUnreadCount(count);
    });

    return () => {
      unsubMessages();
      unsubUnread();
    };
  }, [currentUser]);

  // Handle opening chat window & marking messages as read
  useEffect(() => {
    if (isOpen && currentUser) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      markMessagesRead(currentUser.uid, 'admin').catch(console.error);
    }
  }, [messages, isOpen, currentUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) return;
    
    const msgText = text;
    setText('');
    
    try {
      await sendMessage(currentUser.uid, {
        text: msgText,
        sender: 'client',
        userName: userData?.displayName,
        userEmail: currentUser.email
      });
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const renderMessageText = (text) => {
    const trimmed = text.trim();
    const isConfig = trimmed.startsWith('vmess://') || trimmed.startsWith('vless://') || trimmed.startsWith('trojan://') || trimmed.startsWith('ss://');
    
    if (isConfig) {
      const protocol = trimmed.split('://')[0].toUpperCase();
      return (
        <div className="flex flex-col gap-2 min-w-[160px]">
          <div className="flex items-center gap-2 text-xs font-bold bg-black/20 px-2 py-1.5 rounded-lg w-fit">
            <img src="/v2ray.png" alt="v2ray" className="w-4 h-4 object-contain" /> {protocol} Config
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(trimmed.replace(/\s+/g, ''));
              import('../components/Toast').then(m => m.showToast.success('Config copied!'));
            }}
            className="w-full py-2 bg-slate-950/40 hover:bg-slate-950/80 rounded-lg text-xs font-semibold flex justify-center items-center gap-2 transition-colors border border-white/10"
            title="Copy Configuration"
          >
            <i className="fa-regular fa-copy"></i> Copy
          </button>
        </div>
      );
    }
    return text;
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
                <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMine ? 'self-end' : 'self-start'}`}>
                  <div className={`p-3 text-sm shadow-md break-words ${isMine ? 'bg-cyan-600 text-white rounded-2xl rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-tl-sm'}`}>
                    {renderMessageText(msg.text)}
                  </div>
                  <span className={`text-[9px] text-slate-500 mt-1 ${isMine ? 'text-right pr-1' : 'text-left pl-1'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || 'Now'}
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
