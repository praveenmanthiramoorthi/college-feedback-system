import React, { useState, useMemo } from 'react';
import {
  Users, ShieldCheck, BarChart3, Plus, Trash2, X, Check,
  ChevronDown, Search, Star, TrendingUp, MessageSquare, GraduationCap,
  ClipboardList, Eye, Send, CheckSquare
} from 'lucide-react';
import { useAdminNav } from '../../components/Layout/Layout';

/* ─── Types ──────────────────────────────────────────────────── */
interface StaffMember {
  id: string;
  name: string;
  email: string;
  dept: string;
  subject: string;
  isHOD: boolean;
  status: 'active' | 'inactive';
}

type AudienceKey = 'hod' | 'staff' | 'student' | 'parent';
interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  audience: AudienceKey[];
  questions: string[];
  createdAt: string;
  status: 'active' | 'closed';
  responses: number;
}

const DEPARTMENTS = [
  'CSE', 'CSE (AI&ML)', 'AI&DS', 'CSBS', 'CCE', 'ECE', 'EE (VLSI)', 'Mech', 'Biotech',
];

const AUDIENCE_OPTIONS: { key: AudienceKey; label: string; color: string }[] = [
  { key: 'hod',     label: 'HOD',     color: '#6366f1' },
  { key: 'staff',   label: 'Staff',   color: '#06b6d4' },
  { key: 'student', label: 'Student', color: '#10b981' },
  { key: 'parent',  label: 'Parent',  color: '#f59e0b' },
];

const SEED: StaffMember[] = [
  { id: '1', name: 'Dr. Sarah Wilson', email: 'sarah@college.edu',   dept: 'CSE',        subject: 'Data Structures',    isHOD: true,  status: 'active' },
  { id: '2', name: 'James Anderson',   email: 'james@college.edu',   dept: 'CSE (AI&ML)',subject: 'Machine Learning',   isHOD: true,  status: 'active' },
  { id: '3', name: 'Emily Chen',       email: 'emily@college.edu',   dept: 'AI&DS',      subject: 'Deep Learning',      isHOD: true,  status: 'active' },
  { id: '4', name: 'Michael Brown',    email: 'michael@college.edu', dept: 'CSBS',       subject: 'Business Analytics', isHOD: true,  status: 'active' },
  { id: '5', name: 'Priya Nair',       email: 'priya@college.edu',   dept: 'ECE',        subject: 'Digital Electronics',isHOD: true,  status: 'active' },
  { id: '6', name: 'Robert Kumar',     email: 'robert@college.edu',  dept: 'Mech',       subject: 'Thermodynamics',     isHOD: true,  status: 'active' },
  { id: '7', name: 'Anjali Sharma',    email: 'anjali@college.edu',  dept: 'EE (VLSI)',  subject: 'VLSI Design',        isHOD: true,  status: 'active' },
  { id: '8', name: 'David Patel',      email: 'david@college.edu',   dept: 'Biotech',    subject: 'Bioinformatics',     isHOD: true,  status: 'active' },
  { id: '9', name: 'Kavitha Rajan',    email: 'kavitha@college.edu', dept: 'CCE',        subject: 'Cloud Computing',    isHOD: true,  status: 'active' },
];

const SEED_FORMS: FeedbackForm[] = [
  {
    id: 'f1', title: 'End-of-Semester Faculty Feedback', description: 'Students rate their faculty members at the end of each semester.',
    audience: ['student'], questions: ['How would you rate teaching quality?', 'Was the syllabus covered on time?', 'Rate the faculty approachability.'],
    createdAt: '2026-03-20', status: 'active', responses: 312,
  },
  {
    id: 'f2', title: 'HOD Performance Review', description: 'Staff members provide feedback on HOD leadership and department management.',
    audience: ['staff'], questions: ['How effectively does the HOD communicate?', 'Rate department management.'],
    createdAt: '2026-03-25', status: 'active', responses: 47,
  },
  {
    id: 'f3', title: 'Parent Satisfaction Survey', description: 'Parents share feedback on college communication and student progress.',
    audience: ['parent'], questions: ['Are you satisfied with parent-teacher communication?', "Rate the college's infrastructure."],
    createdAt: '2026-03-28', status: 'closed', responses: 198,
  },
];

/* ─── Pill / Badge ────────────────────────────────────────────── */
const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <span style={{
    padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
    background: `${color}22`, color, border: `1px solid ${color}55`
  }}>{text}</span>
);

const thStyle: React.CSSProperties = {
  padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem',
  fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em'
};
const tdStyle: React.CSSProperties = { padding: '0.9rem 1rem', verticalAlign: 'middle' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' };

/* ═══════════════════════════════════════════════════════════════ */
/*                    ADMIN DASHBOARD                             */
/* ═══════════════════════════════════════════════════════════════ */
const AdminDashboard: React.FC = () => {
  const { page } = useAdminNav();

  const [staff, setStaff] = useState<StaffMember[]>(SEED);
  const [deptFilter, setDeptFilter] = useState('All');
  const [search, setSearch]   = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [staffSubTab, setStaffSubTab] = useState<'directory' | 'hod'>('directory');

  const blank = { name: '', email: '', dept: DEPARTMENTS[0], subject: '', isHOD: false };
  const [form, setForm] = useState(blank);

  // Feedback Forms state
  const [forms, setForms] = useState<FeedbackForm[]>(SEED_FORMS);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [viewingForm, setViewingForm] = useState<FeedbackForm | null>(null);
  const [newForm, setNewForm] = useState({ title: '', description: '', audience: [] as AudienceKey[], questions: [''] });

  /* ── Derived ── */
  const filtered = useMemo(() => staff.filter(s => {
    const matchDept   = deptFilter === 'All' || s.dept === deptFilter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  }), [staff, deptFilter, search]);

  const totalActive    = staff.filter(s => s.status === 'active').length;
  const totalHODs      = staff.filter(s => s.isHOD).length;
  const totalFeedbacks = 138;
  const deptStats      = DEPARTMENTS.map(d => ({
    dept: d, count: staff.filter(s => s.dept === d).length,
    hod: staff.find(s => s.dept === d && s.isHOD)?.name || '—',
  }));

  /* ── HOD toggle ── */
  const toggleHOD = (id: string) => setStaff(prev => {
    const target = prev.find(s => s.id === id)!;
    if (target.isHOD) return prev.map(s => s.id === id ? { ...s, isHOD: false } : s);
    return prev.map(s => s.dept === target.dept ? { ...s, isHOD: s.id === id } : s);
  });

  const deleteStaff   = (id: string) => setStaff(prev => prev.filter(s => s.id !== id));
  const toggleStatus  = (id: string) => setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));

  const addStaff = () => {
    if (!form.name || !form.email || !form.subject) return;
    setStaff(prev => {
      const updated = form.isHOD ? prev.map(s => s.dept === form.dept ? { ...s, isHOD: false } : s) : prev;
      return [...updated, { id: Date.now().toString(), ...form, status: 'active' }];
    });
    setForm(blank); setShowAddForm(false);
  };

  /* ── Feedback Form helpers ── */
  const toggleAudience = (k: AudienceKey) =>
    setNewForm(f => ({ ...f, audience: f.audience.includes(k) ? f.audience.filter(a => a !== k) : [...f.audience, k] }));

  const addQuestion = () => setNewForm(f => ({ ...f, questions: [...f.questions, ''] }));
  const updateQuestion = (i: number, v: string) =>
    setNewForm(f => { const q = [...f.questions]; q[i] = v; return { ...f, questions: q }; });
  const removeQuestion = (i: number) =>
    setNewForm(f => ({ ...f, questions: f.questions.filter((_, idx) => idx !== i) }));

  const publishForm = () => {
    if (!newForm.title || newForm.audience.length === 0 || newForm.questions.filter(q => q.trim()).length === 0) return;
    const entry: FeedbackForm = {
      id: Date.now().toString(), title: newForm.title, description: newForm.description,
      audience: newForm.audience, questions: newForm.questions.filter(q => q.trim()),
      createdAt: new Date().toISOString().slice(0, 10), status: 'active', responses: 0,
    };
    setForms(prev => [entry, ...prev]);
    setNewForm({ title: '', description: '', audience: [], questions: [''] });
    setShowFormBuilder(false);
  };

  const toggleFormStatus = (id: string) =>
    setForms(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'active' ? 'closed' : 'active' } : f));

  const deleteForm = (id: string) => setForms(prev => prev.filter(f => f.id !== id));

  /* ────────────────────────────────────────────────────────────── */
  /*   FILTER BAR (shared)                                         */
  /* ────────────────────────────────────────────────────────────── */
  const FilterBar = () => (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input placeholder="Search by name, email, subject…" value={search}
          onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, marginBottom: 0 }} />
      </div>
      <div style={{ position: 'relative' }}>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          style={{ paddingRight: 36, marginBottom: 0, minWidth: 180 }}>
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
      </div>
    </div>
  );

  /* ────────────────────────────────────────────────────────────── */
  /*  STAFF DIRECTORY sub-tab                                      */
  /* ────────────────────────────────────────────────────────────── */
  const StaffDirectory = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{filtered.length} member{filtered.length !== 1 ? 's' : ''} shown</p>
        <button className="btn-primary" onClick={() => setShowAddForm(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {showAddForm ? <X size={17} /> : <Plus size={17} />}
          {showAddForm ? 'Cancel' : 'Add Staff'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid rgba(99,102,241,.4)' }}>
          <h4 style={{ marginBottom: '1rem', fontWeight: 700 }}>New Staff Member</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.75rem' }}>
            <div><label style={lbl}>Full Name</label>
              <input placeholder="Dr. Full Name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ marginBottom: 0 }} /></div>
            <div><label style={lbl}>Email</label>
              <input type="email" placeholder="name@college.edu" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ marginBottom: 0 }} /></div>
            <div><label style={lbl}>Department</label>
              <select value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} style={{ marginBottom: 0 }}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select></div>
            <div><label style={lbl}>Subject / Specialization</label>
              <input placeholder="e.g. Machine Learning" value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={{ marginBottom: 0 }} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isHOD} onChange={e => setForm(f => ({ ...f, isHOD: e.target.checked }))}
                style={{ width: 'auto', marginBottom: 0 }} />
              Assign as HOD
            </label>
            <button className="btn-primary" onClick={addStaff} style={{ padding: '9px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={16} /> Save
            </button>
          </div>
        </div>
      )}

      <FilterBar />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
              {['Name', 'Department', 'Subject', 'Role', 'Status', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No staff members match your filter.</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--surface-border)', transition: 'background .15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', fontWeight: 800, fontSize: '0.85rem', background: 'rgba(99,102,241,.15)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.email}</p>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.dept}</span></td>
                <td style={tdStyle}><span style={{ fontSize: '0.85rem' }}>{s.subject}</span></td>
                <td style={tdStyle}>{s.isHOD ? <Badge text="HOD" color="#6366f1" /> : <Badge text="Staff" color="#64748b" />}</td>
                <td style={tdStyle}>
                  <button onClick={() => toggleStatus(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', fontSize: '0.82rem', fontWeight: 600, color: s.status === 'active' ? 'var(--success)' : 'var(--error)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.status === 'active' ? 'var(--success)' : 'var(--error)' }} />
                    {s.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggleHOD(s.id)} style={{ padding: '5px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, background: s.isHOD ? 'rgba(239,68,68,.1)' : 'rgba(99,102,241,.1)', color: s.isHOD ? 'var(--error)' : '#6366f1' }}>
                      {s.isHOD ? 'Revoke HOD' : 'Make HOD'}
                    </button>
                    <button onClick={() => deleteStaff(s.id)} style={{ padding: '5px 9px', borderRadius: 6, background: 'rgba(239,68,68,.08)', color: 'var(--error)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  /* ────────────────────────────────────────────────────────────── */
  /*  HOD ASSIGNMENT sub-tab                                       */
  /* ────────────────────────────────────────────────────────────── */
  const HODAssignment = () => (
    <>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        One HOD per department. Assigning a new HOD automatically revokes the existing one.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
        {DEPARTMENTS.map(dept => {
          const deptStaff  = staff.filter(s => s.dept === dept);
          const currentHOD = deptStaff.find(s => s.isHOD);
          return (
            <div key={dept} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{dept}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{deptStaff.length} member{deptStaff.length !== 1 ? 's' : ''}</p>
                </div>
                {currentHOD ? <Badge text="HOD Assigned" color="#10b981" /> : <Badge text="No HOD" color="#ef4444" />}
              </div>
              {currentHOD && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem', borderRadius: 10, background: 'rgba(99,102,241,.08)', marginBottom: '1rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(99,102,241,.2)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                    {currentHOD.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{currentHOD.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{currentHOD.subject}</p>
                  </div>
                  <Star size={16} fill="#6366f1" color="#6366f1" style={{ marginLeft: 'auto' }} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {deptStaff.filter(s => !s.isHOD && s.status === 'active').map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', borderRadius: 8, background: 'rgba(255,255,255,.03)', border: '1px solid var(--surface-border)' }}>
                    <span style={{ fontSize: '0.85rem' }}>{s.name}</span>
                    <button onClick={() => toggleHOD(s.id)} style={{ padding: '4px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, background: 'rgba(99,102,241,.12)', color: '#6366f1' }}>
                      Set HOD
                    </button>
                  </div>
                ))}
                {deptStaff.filter(s => s.status === 'active').length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '0.5rem' }}>No active staff in this department</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  /* ────────────────────────────────────────────────────────────── */
  /*  STAFF MANAGEMENT PAGE                                        */
  /* ────────────────────────────────────────────────────────────── */
  const StaffPage = () => (
    <div className="animate-fade">
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Staff Management</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage staff members and assign Heads of Department</p>
      </header>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
        {([
          { id: 'directory', icon: <Users size={16} />,      label: 'Staff Directory' },
          { id: 'hod',       icon: <ShieldCheck size={16} />, label: 'HOD Assignment' },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setStaffSubTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600,
            background: staffSubTab === tab.id ? 'rgba(99,102,241,0.15)' : 'transparent',
            color: staffSubTab === tab.id ? '#6366f1' : 'var(--text-muted)',
            border: staffSubTab === tab.id ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
            transition: 'all .2s',
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card">
        {staffSubTab === 'directory' ? <StaffDirectory /> : <HODAssignment />}
      </div>
    </div>
  );

  /* ────────────────────────────────────────────────────────────── */
  /*  ANALYTICS PAGE                                               */
  /* ────────────────────────────────────────────────────────────── */
  const AnalyticsPage = () => {
    const feedbackByDept = [
      { dept: 'CSE',        submitted: 87, total: 100 },
      { dept: 'CSE(AI&ML)', submitted: 72, total: 90 },
      { dept: 'AI&DS',      submitted: 63, total: 85 },
      { dept: 'CSBS',       submitted: 55, total: 80 },
      { dept: 'CCE',        submitted: 48, total: 70 },
      { dept: 'ECE',        submitted: 68, total: 85 },
      { dept: 'EE(VLSI)',   submitted: 60, total: 75 },
      { dept: 'Mech',       submitted: 55, total: 80 },
      { dept: 'Biotech',    submitted: 43, total: 70 },
    ];
    const recentActivity = [
      { action: 'Feedback published', by: 'Dr. Sarah Wilson (CSE HOD)',   time: '2 hrs ago',  type: 'feedback' },
      { action: 'New staff added',    by: 'Admin',                         time: '5 hrs ago',  type: 'staff' },
      { action: 'HOD assigned',       by: 'Admin → Priya Nair (ECE)',      time: '1 day ago',  type: 'hod' },
      { action: 'Feedback closed',    by: 'James Anderson (AI&ML HOD)',    time: '2 days ago', type: 'feedback' },
    ];
    const actColor = (t: string) => t === 'feedback' ? '#6366f1' : t === 'hod' ? '#10b981' : '#f59e0b';

    return (
      <div className="animate-fade">
        <header style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>System Analytics</h2>
          <p style={{ color: 'var(--text-muted)' }}>System-wide stats and department performance overview</p>
        </header>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Staff',       value: staff.length,   sub: `${totalActive} active`,               icon: <Users size={20} />,       color: '#6366f1' },
            { label: 'HODs Assigned',     value: totalHODs,      sub: `${DEPARTMENTS.length - totalHODs} unassigned`, icon: <ShieldCheck size={20} />, color: '#10b981' },
            { label: 'Feedbacks Created', value: totalFeedbacks, sub: 'Across all depts',                   icon: <MessageSquare size={20} />, color: '#ec4899' },
            { label: 'Response Rate',     value: '74%',          sub: 'Avg across system',                  icon: <TrendingUp size={20} />,   color: '#f59e0b' },
          ].map(k => (
            <div key={k.label} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${k.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color, marginBottom: '0.75rem' }}>{k.icon}</div>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{k.value}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.35rem' }}>{k.label}</p>
              <p style={{ color: k.color, fontSize: '0.75rem', marginTop: '0.25rem' }}>{k.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Completion bars */}
          <div className="glass-card">
            <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={18} color="#6366f1" /> Feedback Completion by Dept
            </h4>
            {feedbackByDept.map(r => {
              const pct = Math.round((r.submitted / r.total) * 100);
              return (
                <div key={r.dept} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>{r.dept}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{r.submitted}/{r.total} — <b style={{ color: pct >= 80 ? 'var(--success)' : pct >= 60 ? '#f59e0b' : 'var(--error)' }}>{pct}%</b></span>
                  </div>
                  <div style={{ height: 8, borderRadius: 8, background: 'rgba(255,255,255,.07)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 8, width: `${pct}%`, background: pct >= 80 ? 'var(--success)' : pct >= 60 ? '#f59e0b' : 'var(--error)', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="glass-card">
            <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={18} color="#ec4899" /> Recent Activity
            </h4>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: '0.9rem', marginBottom: '0.9rem', borderBottom: i === recentActivity.length - 1 ? 'none' : '1px solid var(--surface-border)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: actColor(a.type), marginTop: 5, flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.87rem' }}>{a.action}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{a.by}</p>
                  <p style={{ color: actColor(a.type), fontSize: '0.73rem', marginTop: 2 }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dept overview table */}
        <div className="glass-card">
          <h4 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Department Overview</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                {['Department', 'Staff Count', 'Current HOD', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {deptStats.map(d => (
                <tr key={d.dept} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={tdStyle}><span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{d.dept}</span></td>
                  <td style={tdStyle}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{d.count}</span></td>
                  <td style={tdStyle}><span style={{ fontSize: '0.85rem' }}>{d.hod}</span></td>
                  <td style={tdStyle}><Badge text={d.hod !== '—' ? 'HOD Active' : 'Needs HOD'} color={d.hod !== '—' ? '#10b981' : '#ef4444'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ────────────────────────────────────────────────────────────── */
  /*  FEEDBACK FORMS PAGE                                          */
  /* ────────────────────────────────────────────────────────────── */
  const FeedbackFormsPage = () => (
    <div className="animate-fade">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Feedback Forms</h2>
          <p style={{ color: 'var(--text-muted)' }}>Create and manage feedback forms for any audience combination</p>
        </div>
        <button className="btn-primary" onClick={() => setShowFormBuilder(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {showFormBuilder ? <X size={17} /> : <Plus size={17} />}
          {showFormBuilder ? 'Cancel' : 'Create Form'}
        </button>
      </header>

      {/* ── Form Builder ── */}
      {showFormBuilder && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid rgba(99,102,241,.4)' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClipboardList size={18} color="#6366f1" /> New Feedback Form
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={lbl}>Form Title *</label>
              <input placeholder="e.g. End-of-Semester Feedback" value={newForm.title}
                onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))} style={{ marginBottom: 0 }} />
            </div>
            <div>
              <label style={lbl}>Description</label>
              <input placeholder="Brief description of this form…" value={newForm.description}
                onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))} style={{ marginBottom: 0 }} />
            </div>
          </div>

          {/* Audience selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={lbl}>Target Audience * (select one or more)</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {AUDIENCE_OPTIONS.map(opt => {
                const sel = newForm.audience.includes(opt.key);
                return (
                  <button key={opt.key} onClick={() => toggleAudience(opt.key)} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 18px', borderRadius: 24, fontSize: '0.88rem', fontWeight: 600,
                    background: sel ? `${opt.color}22` : 'rgba(255,255,255,0.04)',
                    color: sel ? opt.color : 'var(--text-muted)',
                    border: `1.5px solid ${sel ? opt.color : 'var(--surface-border)'}`,
                    transition: 'all .2s',
                  }}>
                    <CheckSquare size={14} style={{ opacity: sel ? 1 : 0.4 }} />
                    {opt.label}
                  </button>
                );
              })}
              {/* "Everyone" shortcut */}
              <button onClick={() => setNewForm(f => ({
                ...f, audience: f.audience.length === AUDIENCE_OPTIONS.length ? [] : AUDIENCE_OPTIONS.map(o => o.key)
              }))} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 24, fontSize: '0.88rem', fontWeight: 600,
                background: newForm.audience.length === AUDIENCE_OPTIONS.length ? 'rgba(236,72,153,.15)' : 'rgba(255,255,255,0.04)',
                color: newForm.audience.length === AUDIENCE_OPTIONS.length ? '#ec4899' : 'var(--text-muted)',
                border: `1.5px solid ${newForm.audience.length === AUDIENCE_OPTIONS.length ? '#ec4899' : 'var(--surface-border)'}`,
                transition: 'all .2s',
              }}>
                <Users size={14} /> Everyone
              </button>
            </div>
          </div>

          {/* Questions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={lbl}>Questions *</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {newForm.questions.map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', minWidth: 22 }}>Q{i + 1}.</span>
                  <input value={q} onChange={e => updateQuestion(i, e.target.value)}
                    placeholder={`Question ${i + 1}…`} style={{ marginBottom: 0, flex: 1 }} />
                  {newForm.questions.length > 1 && (
                    <button onClick={() => removeQuestion(i)} style={{ background: 'rgba(239,68,68,.1)', color: 'var(--error)', padding: '8px', borderRadius: 6 }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addQuestion} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                background: 'rgba(99,102,241,.08)', color: '#6366f1', fontSize: '0.85rem', fontWeight: 600, alignSelf: 'flex-start'
              }}>
                <Plus size={14} /> Add Question
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={publishForm}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Send size={15} /> Publish Form
            </button>
            <button onClick={() => setShowFormBuilder(false)}
              style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(255,255,255,.05)', color: 'var(--text-muted)', fontWeight: 600 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Form Result Modal ── */}
      {viewingForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setViewingForm(null)}>
          <div className="glass-card" style={{ maxWidth: 580, width: '90%', padding: '2rem', border: '1px solid rgba(99,102,241,.4)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{viewingForm.title}</h3>
                {viewingForm.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>{viewingForm.description}</p>}
              </div>
              <button onClick={() => setViewingForm(null)} style={{ background: 'transparent', color: 'var(--text-muted)', padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {viewingForm.audience.map(a => {
                const opt = AUDIENCE_OPTIONS.find(o => o.key === a)!;
                return <Badge key={a} text={opt.label} color={opt.color} />;
              })}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1' }}>{viewingForm.responses}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Responses</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{viewingForm.questions.length}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Questions</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: viewingForm.status === 'active' ? 'var(--success)' : 'var(--error)', marginTop: '0.6rem' }}>
                  {viewingForm.status.toUpperCase()}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</p>
              </div>
            </div>
            <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Questions</h4>
            <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {viewingForm.questions.map((q, i) => (
                <li key={i} style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{q}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* ── Forms List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {forms.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No feedback forms yet. Click "Create Form" to get started.
          </div>
        )}
        {forms.map(f => (
          <div key={f.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.4rem' }}>
                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{f.title}</h4>
                <Badge text={f.status === 'active' ? 'Active' : 'Closed'} color={f.status === 'active' ? '#10b981' : '#ef4444'} />
              </div>
              {f.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>{f.description}</p>}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {f.audience.map(a => {
                  const opt = AUDIENCE_OPTIONS.find(o => o.key === a)!;
                  return <Badge key={a} text={opt.label} color={opt.color} />;
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1' }}>{f.responses}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Responses</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#06b6d4' }}>{f.questions.length}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Questions</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{f.createdAt}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Created</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => setViewingForm(f)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, background: 'rgba(99,102,241,.1)', color: '#6366f1', fontSize: '0.82rem', fontWeight: 600 }}>
                <Eye size={14} /> View
              </button>
              <button onClick={() => toggleFormStatus(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, background: f.status === 'active' ? 'rgba(239,68,68,.1)' : 'rgba(16,185,129,.1)', color: f.status === 'active' ? 'var(--error)' : 'var(--success)', fontSize: '0.82rem', fontWeight: 600 }}>
                {f.status === 'active' ? <X size={14} /> : <Check size={14} />}
                {f.status === 'active' ? 'Close' : 'Reopen'}
              </button>
              <button onClick={() => deleteForm(f.id)} style={{ padding: '7px 10px', borderRadius: 8, background: 'rgba(239,68,68,.08)', color: 'var(--error)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ────────────────────────────────────────────────────────────── */
  /*  ROUTER                                                       */
  /* ────────────────────────────────────────────────────────────── */
  if (page === 'analytics')      return <AnalyticsPage />;
  if (page === 'feedback-forms') return <FeedbackFormsPage />;
  return <StaffPage />;
};

export default AdminDashboard;
