import React from 'react';
import { MessageCircle, BarChart, ShieldCheck } from 'lucide-react';

const ParentDashboard: React.FC = () => {
    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Parent Portal</h2>
                <p style={{ color: 'var(--text-muted)' }}>Feedback regarding institutional facilities and ward's progress.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <MessageCircle color="var(--secondary)" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Institutional Feedback</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Review college infrastructure, transportation, and safety measures.</p>
                    <button className="btn-primary" style={{ background: 'var(--secondary)', width: '100%' }}>View Forms</button>
                </div>

                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <BarChart color="var(--accent)" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Academic Review</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Share feedback about curriculum and faculty interaction.</p>
                    <button className="btn-primary" style={{ background: 'var(--accent)', width: '100%' }}>View Forms</button>
                </div>
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ marginRight: '1.5rem', marginTop: '0.25rem' }}>
                        <ShieldCheck size={32} color="var(--primary)" />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Security & Grievance</h4>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Direct channel to the college administration for sensitive matters or security concerns.
                            All submissions are handled with strict confidentiality.
                        </p>
                        <button style={{ marginTop: '1rem', background: 'transparent', color: 'var(--primary)', fontWeight: 700, border: 'none', padding: 0 }}>
                            Submit Grievance →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
