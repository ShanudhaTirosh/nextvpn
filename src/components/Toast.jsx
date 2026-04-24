import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

export const ToastContainer = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--bg-panel)',
          color: 'var(--text-primary)',
          border: '1px solid var(--glass-border)',
          borderRadius: '10px',
          boxShadow: 'var(--glass-shadow)',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.9rem',
        },
        success: {
          iconTheme: {
            primary: 'var(--accent-green)',
            secondary: 'var(--bg-panel)',
          },
          style: {
            borderColor: 'var(--accent-green)',
          }
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: 'var(--bg-panel)',
          },
          style: {
            borderColor: '#EF4444',
          }
        },
      }}
    />
  );
};

export const showToast = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast.custom((t) => (
    <div
      style={{
        background: 'var(--bg-panel)',
        color: 'var(--text-primary)',
        border: '1px solid var(--accent-cyan)',
        padding: '12px 16px',
        borderRadius: '10px',
        boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.9rem',
        animation: t.visible ? 'scale-in 0.3s ease' : 'none'
      }}
    >
      <i className="fa-solid fa-circle-info" style={{ color: 'var(--accent-cyan)' }}></i>
      {msg}
    </div>
  ), { id: msg, duration: 4000 })
};
