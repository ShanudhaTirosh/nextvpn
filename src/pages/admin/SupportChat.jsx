import React, { useState, useEffect, useRef } from 'react';
import { 
  subscribeToAllChats, 
  subscribeToMessages, 
  sendMessage, 
  markMessagesRead 
} from '../../firebase/chatService';

const SupportChat = () => {
  const [chatList, setChatList] = useState([]);
  const [activeMessages, setActiveMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeUid, setActiveUid] = useState(null);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // Subscribe to all chats metadata for the sidebar
  useEffect(() => {
    const unsub = subscribeToAllChats((chats) => {
      setChatList(chats);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Subscribe to messages for the active chat and mark them as read
  useEffect(() => {
    if (!activeUid) {
      setActiveMessages([]);
      return;
    }
    
    const unsub = subscribeToMessages(activeUid, (msgs) => {
      setActiveMessages(msgs);
    });

    // Mark messages as read when viewing
    markMessagesRead(activeUid, 'client').catch(console.error);

    return () => unsub();
  }, [activeUid]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const activeChat = chatList.find(c => c.chatId === activeUid) || null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeUid) return;
    
    const msgText = text;
    setText('');
    
    try {
      await sendMessage(activeUid, {
        text: msgText,
        sender: 'admin'
      });
    } catch (err) {
      console.error('Failed to send admin message', err);
    }
  };

  const renderMessageText = (text) => {
    const trimmed = text.trim();
    const isConfig = trimmed.startsWith('vmess://') || trimmed.startsWith('vless://') || trimmed.startsWith('trojan://') || trimmed.startsWith('ss://');
    
    if (isConfig) {
      const protocol = trimmed.split('://')[0].toUpperCase();
      return (
        <div className="flex flex-col gap-2 min-w-[180px]">
          <div className="flex items-center gap-2 text-xs font-bold bg-black/20 px-2 py-1.5 rounded-lg w-fit">
            <img src="/v2ray.png" alt="v2ray" className="w-4 h-4 object-contain" /> {protocol} Config
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(trimmed.replace(/\s+/g, ''));
              import('../../components/Toast').then(m => m.showToast.success('Config copied!'));
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

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-1">Support Chat</h1>
        <p className="text-slate-500 text-sm">Real-time chat with your clients.</p>
      </div>

      <div className="flex-1 flex overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
        {/* Chat List (Sidebar) */}
        <div className="w-1/3 max-w-[300px] border-r border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <h2 className="font-bold text-white">Active Chats ({chatList.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex justify-center py-8"><i className="fa-solid fa-spinner animate-spin text-cyan-500"></i></div>
            ) : chatList.length === 0 ? (
              <div className="text-center py-8 text-slate-600 text-sm">No active chats</div>
            ) : (
              chatList.map(chat => (
                <button
                  key={chat.chatId}
                  onClick={() => setActiveUid(chat.chatId)}
                  className={`w-full text-left p-4 border-b border-slate-800/50 transition-colors ${activeUid === chat.chatId ? 'bg-cyan-500/10 border-l-2 border-l-cyan-500' : 'hover:bg-slate-800/50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-white text-sm truncate">{chat.userName || 'User'}</span>
                    {chat.adminUnread > 0 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold">{chat.adminUnread}</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{chat.userEmail || ''}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-950/30">
          {activeUid ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white">{activeChat?.userName}</h3>
                  <p className="text-xs text-slate-500">{activeChat?.userEmail} • UID: {activeUid.slice(0, 8)}...</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                {activeMessages.map(msg => {
                  const isMine = msg.sender === 'admin';
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMine ? 'self-end' : 'self-start'}`}>
                      <div className={`p-3 shadow-md text-sm break-words ${isMine ? 'bg-cyan-600 text-white rounded-2xl rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-tl-sm'}`}>
                        {renderMessageText(msg.text)}
                      </div>
                      <span className={`text-[10px] text-slate-500 mt-1 ${isMine ? 'text-right pr-1' : 'text-left pl-1'}`}>
                        {new Date(msg.createdAt).toLocaleString([], {month:'short', day:'numeric', hour: '2-digit', minute:'2-digit'}) || 'Now'}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="px-6 rounded-xl bg-cyan-600 text-white font-bold disabled:opacity-50 hover:bg-cyan-500 transition-colors"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <i className="fa-solid fa-comments text-4xl mb-4 text-slate-700"></i>
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
