import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Users, GraduationCap, ClipboardList, Send } from 'lucide-react';

const StaffDashboard: React.FC = () => {
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [targetType, setTargetType] = useState<'student' | 'staff'>('student');

    const feedbacks = [
        { id: '1', title: 'Course Satisfaction Q1', target: 'student', replies: 45, date: '2024-03-10' },
        { id: '2', title: 'Department Infrastructure', target: 'student', replies: 32, date: '2024-03-08' },
        ...(user?.isHOD ? [
            { id: '3', title: 'Inter-Departmental Coordination', target: 'staff', replies: 12, date: '2024-03-05' }
        ] : [])
    ];

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{user?.isHOD ? 'HOD Dashboard' : 'Staff Dashboard'}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {user?.department} | {user?.isHOD ? 'Head of Department' : 'Faculty Member'}
                    </p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(true)}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Create Feedback
                </button>
            </header>

            {showForm && (
                <div className="glass-card" style={{ marginBottom: '2.5rem', position: 'relative' }}>
                    <button
                        onClick={() => setShowForm(false)}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}
                    >✕</button>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Generate New Feedback Form</h3>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <button
                            onClick={() => setTargetType('student')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '12px',
                                background: targetType === 'student' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                border: `1px solid ${targetType === 'student' ? 'var(--primary)' : 'var(--surface-border)'}`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <GraduationCap size={24} style={{ marginBottom: '0.5rem', color: targetType === 'student' ? 'var(--primary)' : 'var(--text-muted)' }} />
                            <span style={{ fontWeight: 600 }}>For Students</span>
                        </button>

                        {user?.isHOD && (
                            <button
                                onClick={() => setTargetType('staff')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: targetType === 'staff' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    border: `1px solid ${targetType === 'staff' ? 'var(--primary)' : 'var(--surface-border)'}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                            >
                                <Users size={24} style={{ marginBottom: '0.5rem', color: targetType === 'staff' ? 'var(--primary)' : 'var(--text-muted)' }} />
                                <span style={{ fontWeight: 600 }}>For Faculty</span>
                            </button>
                        )}
                    </div>

                    <input type="text" placeholder="Feedback Title (e.g., Annual Lab Evaluation)" />
                    <textarea placeholder="Form Description / Instructions" rows={3}></textarea>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px dashed var(--surface-border)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            + Add Questionnaire Fields (Rating, Text, Multiple Choice)
                        </p>
                    </div>

                    <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Send size={18} style={{ marginRight: '0.5rem' }} /> Publish Feedback Form
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {feedbacks.map(f => (
                    <div key={f.id} className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                background: f.target === 'student' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                color: f.target === 'student' ? 'var(--success)' : 'var(--warning)',
                                textTransform: 'uppercase'
                            }}>
                                {f.target}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.date}</span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{f.title}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
                            <ClipboardList size={16} style={{ marginRight: '0.5rem' }} />
                            <span>{f.replies} Responses Received</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffDashboard;
