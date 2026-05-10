import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

async function getWebhookUrls() {
  try {
    const snap = await getDoc(doc(db, 'siteSettings', 'webhooks'));
    return snap.exists() ? snap.data() : {};
  } catch {
    return {};
  }
}

function buildEmbed(data) {
  return {
    username: 'NovaVPN',
    embeds: [data],
  };
}

export async function postPaymentWebhook({ userEmail, planName, proofBase64, method, paymentId }) {
  const urls = await getWebhookUrls();
  if (!urls.payments) return;

  const embed = buildEmbed({
    title: '💳 New Payment Proof',
    color: 0x7c3aed,
    fields: [
      { name: 'User', value: userEmail || 'Unknown', inline: true },
      { name: 'Plan', value: planName || 'Unknown', inline: true },
      { name: 'Method', value: method?.toUpperCase() || '-', inline: true },
      { name: 'Payment ID', value: paymentId || '-', inline: false },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'NovaVPN Admin' },
  });

  try {
    await fetch(urls.payments, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed),
    });
  } catch (err) {
    console.error('Payment webhook failed:', err);
  }
}

export async function postChatWebhook({ username, message, uid }) {
  const urls = await getWebhookUrls();
  if (!urls.chat) return;

  const embed = buildEmbed({
    title: '💬 New Chat Message',
    color: 0x06b6d4,
    description: message.slice(0, 200),
    fields: [
      { name: 'From', value: username || 'Unknown', inline: true },
      { name: 'UID', value: uid || '-', inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'NovaVPN Chat' },
  });

  try {
    await fetch(urls.chat, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed),
    });
  } catch (err) {
    console.error('Chat webhook failed:', err);
  }
}

export async function postContactWebhook({ name, email, message }) {
  const urls = await getWebhookUrls();
  if (!urls.contact) return;

  const embed = buildEmbed({
    title: '📬 New Contact Form Submission',
    color: 0xf472b6,
    fields: [
      { name: 'Name', value: name || 'Unknown', inline: true },
      { name: 'Email', value: email || 'Unknown', inline: true },
      { name: 'Message', value: message.slice(0, 500) || '-', inline: false },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'NovaVPN Contact Form' },
  });

  try {
    await fetch(urls.contact, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed),
    });
  } catch (err) {
    console.error('Contact webhook failed:', err);
  }
}
