import { Link } from 'react-router-dom';
import { Zap, MessageCircle, Send, Github } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Footer() {
  const { settings } = useSiteSettings();
  const footer = settings.footer;
  const navbar = settings.navbar;
  const contact = settings.contact;

  return (
    <footer style={{
      position: 'relative',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(3,0,20,0.8)',
      backdropFilter: 'blur(12px)',
      padding: '60px 24px 32px',
      marginTop: '80px',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              {navbar.logoBase64 ? (
                <img src={`data:image/png;base64,${navbar.logoBase64}`} alt="logo" style={{ height: '28px' }} />
              ) : (
                <div style={{
                  width: 28, height: 28, borderRadius: '8px',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Zap size={14} color="#fff" fill="#fff" />
                </div>
              )}
              <span style={{
                fontWeight: 700, fontSize: '16px',
                background: 'linear-gradient(90deg, #a78bfa, #38bdf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {navbar.brandName || 'NovaVPN'}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, maxWidth: '220px' }}>
              {footer.tagline}
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {footer.social?.discord && (
                <a href={footer.social.discord} target="_blank" rel="noopener noreferrer" style={socialStyle}>
                  <MessageCircle size={15} />
                </a>
              )}
              {footer.social?.telegram && (
                <a href={footer.social.telegram} target="_blank" rel="noopener noreferrer" style={socialStyle}>
                  <Send size={15} />
                </a>
              )}
              {footer.social?.whatsapp && (
                <a href={footer.social.whatsapp} target="_blank" rel="noopener noreferrer" style={socialStyle}>
                  <MessageCircle size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(footer.links || []).map((l, i) => (
                <Link
                  key={i}
                  to={l.href}
                  style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#a78bfa'}
                  onMouseLeave={e => e.target.style.color = '#64748b'}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {contact.email && (
                <a href={`mailto:${contact.email}`} style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>
                  {contact.email}
                </a>
              )}
              {contact.discord && (
                <a href={contact.discord} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>
                  Discord Server
                </a>
              )}
              {contact.telegram && (
                <a href={contact.telegram} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>
                  Telegram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ fontSize: '13px', color: '#334155' }}>{footer.copyright}</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: '#334155' }}>Privacy Policy</span>
            <span style={{ fontSize: '12px', color: '#334155' }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const socialStyle = {
  width: 32, height: 32, borderRadius: '50%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s',
};
