import { useRef, useState } from 'react';
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react';

export default function ProofUploader({ onCapture, value }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const processFile = (file) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 500 * 1024) {
      setError('Image must be under 500KB. Please compress the image first.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      // Strip prefix, store pure base64
      const base64 = dataUrl.split(',')[1];
      onCapture(base64, file.type);
    };
    reader.onerror = () => setError('Failed to read file. Please try again.');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      {!value ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragging ? 'rgba(124,58,237,0.7)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '16px',
            padding: '40px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: '12px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Upload size={20} color="#a78bfa" />
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px' }}>
            Click or drag & drop screenshot
          </p>
          <p style={{ fontSize: '13px', color: '#64748b' }}>JPG, PNG — Max 500KB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => processFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(52,211,153,0.3)',
        }}>
          <img
            src={`data:image/jpeg;base64,${value}`}
            alt="Payment proof"
            style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', background: '#0a0a1a' }}
          />
          <button
            onClick={() => onCapture(null, null)}
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer', color: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} />
          </button>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '20px 16px 10px',
            fontSize: '12px', color: '#34d399',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <ImageIcon size={12} /> Screenshot uploaded
          </div>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '10px',
          padding: '10px 14px',
          borderRadius: '10px',
          background: 'rgba(244,63,94,0.1)',
          border: '1px solid rgba(244,63,94,0.2)',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '13px', color: '#fb7185',
        }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
}
