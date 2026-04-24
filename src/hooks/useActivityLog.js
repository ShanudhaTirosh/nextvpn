import { addDocument } from '../firebase/firestore';

/**
 * Utility to log admin/system events to the activity_logs Firestore collection.
 * @param {string} type - 'payment' | 'user' | 'server' | 'system'
 * @param {string} message - Human-readable event description
 * @param {string} [severity] - 'success' | 'warning' | 'danger' | 'info'
 */
export const logActivity = async (type, message, severity = 'info') => {
  try {
    await addDocument('activity_logs', { type, message, severity });
  } catch (err) {
    console.warn('[ActivityLog] Failed to write log:', err);
  }
};
