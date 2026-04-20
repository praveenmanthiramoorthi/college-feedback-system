import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Shield, Award, Users, 
  BarChart, Globe, GraduationCap 
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container" style={{ minHeight: '100vh', background: '#fff', color: '#1a1a1a' }}>
      {/* Navigation */}
      <nav style={{ 
        padding: '1.5rem 5%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'var(--primary)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <GraduationCap size={24} />
          </div>
          <span style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontWeight: 800, 
            fontSize: '1.4rem', 
            color: 'var(--primary)',
            letterSpacing: '-0.02em'
          }}>INSTITUTION FEEDBACK</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/login/student')}
            style={{ padding: '10px 24px', borderRadius: '50px' }}
          >
            Access Portal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ 
        padding: '100px 5%', 
        textAlign: 'center',
        background: 'linear-gradient(rgba(30,58,138,0.02), rgba(255,255,255,1))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="animate-fade-up">
          <Badge text="Official Institutional Platform" color="var(--primary)" />
          <h1 style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontSize: '4.5rem', 
            fontWeight: 900, 
            color: 'var(--primary)',
            maxWidth: '1000px',
            margin: '1.5rem auto',
            lineHeight: 1.1
          }}>
            Elevating Educational Excellence Through Voice.
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#666', 
            maxWidth: '700px', 
            margin: '0 auto 2.5rem' 
          }}>
            A secure, professional environment for students and faculty to collaborate on institutional growth through structured feedback and real-time analytics.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem', borderRadius: '50px' }} onClick={() => navigate('/login/student')}>
              Get Started <ChevronRight size={20} style={{ marginLeft: '8px' }} />
            </button>
            <button style={{ 
              padding: '15px 40px', 
              fontSize: '1.1rem', 
              borderRadius: '50px', 
              background: 'transparent', 
              border: '1px solid #ddd',
              fontWeight: 600
            }}>
              Core Protocol
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section style={{ padding: '60px 5%', background: '#fff' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          {[
            { label: 'Registered Students', val: '5,000+' },
            { label: 'Faculty Members', val: '300+' },
            { label: 'Published Reports', val: '1,200+' },
            { label: 'System Uptime', val: '99.9%' },
          ].map((s, i) => (
            <div key={i}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>{s.val}</h2>
              <p style={{ color: '#666', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 5%', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>Academic Administration Reinvented</h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Designed for high-capacity institutional data management.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '2.5rem',
          maxWidth: '1300px',
          margin: '0 auto'
        }}>
          {[
            { 
              icon: <Shield size={32} />, 
              title: 'Anonymity Assured', 
              desc: 'Advanced encryption protocols ensure student feedback remains strictly private while maintaining integrity.' 
            },
            { 
              icon: <BarChart size={32} />, 
              title: 'Advanced Analytics', 
              desc: 'Heads of Departments receive detailed statistical insights to drive curriculum and teaching improvements.' 
            },
            { 
              icon: <Globe size={32} />, 
              title: 'Bulk Management', 
              desc: 'Seamlessly handle data for over 5,000 users with optimized CSV processing and architectural scaling.' 
            },
            { 
              icon: <Users size={32} />, 
              title: 'Role-Based Access', 
              desc: 'Clear hierarchical protocol ensuring students, staff, and admins access only relevant data points.' 
            },
            { 
              icon: <Award size={32} />, 
              title: 'Quality Compliance', 
              desc: 'Meets national institutional standards for faculty evaluation and administrative transparency.' 
            },
            { 
              icon: <ClipboardList size={32} />, 
              title: 'Dynamic Forms', 
              desc: 'Customizable feedback templates tailored for various academic departments and specializations.' 
            },
          ].map((f, i) => (
            <div key={i} className="glass-card" style={{ 
              padding: '2.5rem', 
              background: '#fff', 
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'rgba(30,58,138,0.05)', 
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '1.5rem'
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>{f.title}</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 5%', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '2rem' }}>
          <GraduationCap size={32} />
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: '1.6rem' }}>INSTITUTION FEEDBACK</span>
        </div>
        <p style={{ opacity: 0.7, marginBottom: '2rem' }}>© 2026 Academic Information Systems. All Rights Reserved.</p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Institutional Terms</span>
          <span style={{ cursor: 'pointer', opacity: 0.8 }}>Help Center</span>
        </div>
      </footer>
    </div>
  );
};

const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <span style={{
    padding: '8px 20px', 
    borderRadius: 50, 
    fontSize: '0.85rem', 
    fontWeight: 700,
    background: `${color}11`, 
    color, 
    border: `1px solid ${color}33`,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }}>{text}</span>
);

export default LandingPage;
