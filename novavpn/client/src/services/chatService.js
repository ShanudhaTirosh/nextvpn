import { ref, push, onValue, update, serverTimestamp, query, orderByChild, limitToLast } from 'firebase/database';
import { rtdb } from '../firebase';

export async function sendChatMessage(uid, text, sender = 'user') {
  const chatRef = ref(rtdb, `chats/${uid}/messages`);
  await push(chatRef, {
    text,
    sender,
    timestamp: Date.now(),
    read: sender === 'admin' ? false : true,
  });
}

export function subscribeToChat(uid, callback) {
  const chatRef = query(
    ref(rtdb, `chats/${uid}/messages`),
    orderByChild('timestamp'),
    limitToLast(100)
  );
  return onValue(chatRef, (snap) => {
    const msgs = [];
    snap.forEach((child) => {
      msgs.push({ id: child.key, ...child.val() });
    });
    callback(msgs);
  });
}

export function subscribeToAllChats(callback) {
  const allChatsRef = ref(rtdb, 'chats');
  return onValue(allChatsRef, (snap) => {
    const chats = {};
    snap.forEach((userSnap) => {
      const uid = userSnap.key;
      const msgs = [];
      userSnap.child('messages').forEach((msgSnap) => {
        msgs.push({ id: msgSnap.key, ...msgSnap.val() });
      });
      chats[uid] = msgs.sort((a, b) => a.timestamp - b.timestamp);
    });
    callback(chats);
  });
}

export async function markMessagesRead(uid) {
  const chatRef = ref(rtdb, `chats/${uid}/messages`);
  // Get all unread messages and mark them read
  onValue(chatRef, (snap) => {
    const updates = {};
    snap.forEach((child) => {
      if (!child.val().read && child.val().sender === 'user') {
        updates[`chats/${uid}/messages/${child.key}/read`] = true;
      }
    });
    if (Object.keys(updates).length > 0) update(ref(rtdb), updates);
  }, { onlyOnce: true });
}
