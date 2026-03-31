import React from 'react';
import { Star, Clock, CheckCircle } from 'lucide-react';

const StudentDashboard: React.FC = () => {
    const pendingFeedbacks = [
        { id: '1', title: 'Python Programming - Dr. Rajesh', dept: 'CSE', deadline: '2 Days left' },
        { id: '2', title: 'Hostel Facility Feedback', dept: 'Admin', deadline: '5 Days left' },
    ];

    const completedFeedbacks = [
        { id: '3', title: 'Data Structures - Prof. Gupta', date: 'Mar 05, 2024' },
        { id: '4', title: 'Sports Meet 2024', date: 'Feb 28, 2024' },
    ];

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Student Portal</h2>
                <p style={{ color: 'var(--text-muted)' }}>Share your thoughts to help us improve your learning experience.</p>
            </header>

            <section style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                    <Clock size={20} style={{ marginRight: '0.75rem', color: 'var(--warning)' }} />
                    Pending Feedback
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {pendingFeedbacks.map(f => (
                        <div key={f.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Department: {f.dept}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 600 }}>{f.deadline}</span>
                                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Start Survey</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                    <CheckCircle size={20} style={{ marginRight: '0.75rem', color: 'var(--success)' }} />
                    Completed
                </h3>
                <div className="glass-card" style={{ padding: 0 }}>
                    {completedFeedbacks.map((f, i) => (
                        <div key={f.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '1.25rem 1.5rem',
                            borderBottom: i === completedFeedbacks.length - 1 ? 'none' : '1px solid var(--surface-border)'
                        }}>
                            <div>
                                <p style={{ fontWeight: 600 }}>{f.title}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Submitted on {f.date}</p>
                            </div>
                            <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
                                <Star size={16} fill="var(--success)" style={{ marginRight: '0.25rem' }} />
                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Success</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;
