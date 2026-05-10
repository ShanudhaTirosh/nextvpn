import { useEffect, useRef } from 'react';

export default function MeshBackground() {
  return (
    <div className="mesh-bg" aria-hidden="true">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="dot-grid" />
      <style>{`
        .mesh-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.18;
          animation: orbDrift 20s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #7c3aed, transparent 70%);
          top: -150px; left: -100px;
          animation-duration: 22s;
        }
        .orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #06b6d4, transparent 70%);
          top: 30%; right: -150px;
          animation-duration: 18s;
          animation-delay: -8s;
        }
        .orb-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #f472b6, transparent 70%);
          bottom: -100px; left: 30%;
          animation-duration: 25s;
          animation-delay: -14s;
        }
        @keyframes orbDrift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(60px, -40px) scale(1.08); }
          66%  { transform: translate(-30px, 60px) scale(0.95); }
          100% { transform: translate(40px, 20px) scale(1.05); }
        }
        .dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(124,58,237,0.12) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>
    </div>
  );
}
