import { getIdToken } from 'firebase/auth';
import { auth } from '../firebase';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

async function getAuthHeaders() {
  const token = await getIdToken(auth.currentUser, true);
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function fetchClientUsage(uuid) {
  if (!uuid) return null;
  const headers = await getAuthHeaders();
  const res = await fetch(`${SERVER_URL}/api/panel/client/${uuid}`, { headers });
  if (!res.ok) throw new Error(`Panel API error: ${res.status}`);
  return res.json();
}

export async function fetchAllClients() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${SERVER_URL}/api/panel/all-clients`, { headers });
  if (!res.ok) throw new Error(`Panel API error: ${res.status}`);
  return res.json();
}

export async function syncClients() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${SERVER_URL}/api/sync`, { method: 'POST', headers });
  if (!res.ok) throw new Error(`Sync error: ${res.status}`);
  return res.json();
}
