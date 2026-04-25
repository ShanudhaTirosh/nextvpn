import { rtdb } from './firebaseConfig';
import { ref, push, onValue, update, get } from 'firebase/database';

/* ─────────────────────────────────────────────
   Firebase Realtime Database Chat Service
   
   Structure:
   /chats/{chatId}/
     metadata: { uid, userName, userEmail, createdAt, lastMessage, lastMessageAt, adminUnread, clientUnread }
     messages/{msgId}: { text, sender, createdAt, read }
   
   chatId === user's Firebase UID for simplicity (1 chat per user)
───────────────────────────────────────────── */

// ── Send a message ──
export const sendMessage = async (chatId, { text, sender, userName, userEmail }) => {
  const msgRef = ref(rtdb, `chats/${chatId}/messages`);
  const metaRef = ref(rtdb, `chats/${chatId}/metadata`);

  // Push the message
  await push(msgRef, {
    text,
    sender, // 'client' or 'admin'
    createdAt: Date.now(),
    read: false
  });

  // Update metadata
  const metaUpdate = {
    uid: chatId,
    lastMessage: text.length > 60 ? text.slice(0, 60) + '…' : text,
    lastMessageAt: Date.now()
  };

  if (sender === 'client') {
    metaUpdate.userName = userName || 'User';
    metaUpdate.userEmail = userEmail || '';
  }

  await update(metaRef, metaUpdate);

  // Increment unread counter for the other side
  const metaSnap = await get(metaRef);
  const currentMeta = metaSnap.val() || {};

  if (sender === 'client') {
    await update(metaRef, { adminUnread: (currentMeta.adminUnread || 0) + 1 });
  } else {
    await update(metaRef, { clientUnread: (currentMeta.clientUnread || 0) + 1 });
  }
};

// ── Initialize chat metadata (called once when client first opens chat) ──
export const initChat = async (uid, userName, userEmail) => {
  const metaRef = ref(rtdb, `chats/${uid}/metadata`);
  const snap = await get(metaRef);
  if (!snap.exists()) {
    await update(metaRef, {
      uid,
      userName: userName || 'User',
      userEmail: userEmail || '',
      createdAt: Date.now(),
      lastMessage: '',
      lastMessageAt: Date.now(),
      adminUnread: 0,
      clientUnread: 0
    });
  } else {
    // Update name/email in case they changed
    await update(metaRef, {
      userName: userName || snap.val().userName || 'User',
      userEmail: userEmail || snap.val().userEmail || ''
    });
  }
};

// ── Subscribe to messages for a specific chat ──
export const subscribeToMessages = (chatId, callback) => {
  const msgRef = ref(rtdb, `chats/${chatId}/messages`);
  return onValue(msgRef, (snap) => {
    const data = snap.val();
    if (!data) {
      callback([]);
      return;
    }
    const messages = Object.entries(data)
      .map(([id, msg]) => ({ id, ...msg }))
      .sort((a, b) => a.createdAt - b.createdAt);
    callback(messages);
  });
};

// ── Subscribe to all chat metadata (admin sidebar) ──
export const subscribeToAllChats = (callback) => {
  const chatsRef = ref(rtdb, 'chats');
  return onValue(chatsRef, (snap) => {
    const data = snap.val();
    if (!data) {
      callback([]);
      return;
    }
    const chatList = Object.entries(data)
      .map(([chatId, chatData]) => ({
        chatId,
        ...(chatData.metadata || {}),
        messageCount: chatData.messages ? Object.keys(chatData.messages).length : 0
      }))
      .filter(c => c.uid) // only chats with metadata
      .sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0));
    callback(chatList);
  });
};

// ── Mark messages as read ──
export const markMessagesRead = async (chatId, senderToMark) => {
  const msgRef = ref(rtdb, `chats/${chatId}/messages`);
  const snap = await get(msgRef);
  const data = snap.val();
  if (!data) return;

  const updates = {};
  Object.entries(data).forEach(([msgId, msg]) => {
    if (msg.sender === senderToMark && !msg.read) {
      updates[`chats/${chatId}/messages/${msgId}/read`] = true;
    }
  });

  // Reset unread counter
  if (senderToMark === 'client') {
    updates[`chats/${chatId}/metadata/adminUnread`] = 0;
  } else {
    updates[`chats/${chatId}/metadata/clientUnread`] = 0;
  }

  if (Object.keys(updates).length > 0) {
    await update(ref(rtdb), updates);
  }
};

// ── Get unread count for client ──
export const subscribeToClientUnread = (chatId, callback) => {
  const metaRef = ref(rtdb, `chats/${chatId}/metadata/clientUnread`);
  return onValue(metaRef, (snap) => {
    callback(snap.val() || 0);
  });
};

// ── Typing indicator ──
export const setTyping = (chatId, who, isTyping) => {
  update(ref(rtdb), { [`chats/${chatId}/typing/${who}`]: isTyping ? Date.now() : null });
};

export const subscribeToTyping = (chatId, who, callback) => {
  const typingRef = ref(rtdb, `chats/${chatId}/typing/${who}`);
  return onValue(typingRef, (snap) => {
    const val = snap.val();
    // Consider typing if set within last 5 seconds
    callback(val && (Date.now() - val) < 5000);
  });
};
