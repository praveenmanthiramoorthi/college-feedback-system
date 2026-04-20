import React, { useState, useMemo } from 'react';
import {
  Plus, Trash2, X, Check,
  ChevronDown, Search, Star
} from 'lucide-react';
import { useAdminNav } from '../../components/Layout/Layout';
import { useNotification } from '../../context/NotificationContext';

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

/* ─── Shared Components ────────────────────────────────────────── */
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

/* ─── Static Sub-Components ────────────────────────────────────── */

const FilterBar: React.FC<{ search: string; setSearch: (s: string) => void; deptFilter: string; setDeptFilter: (d: string) => void }> = ({ search, setSearch, deptFilter, setDeptFilter }) => (
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

interface StaffDirectoryProps {
  filteredCount: number; showAddForm: boolean; setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  form: { name: string; email: string; dept: string; subject: string; isHOD: boolean }; 
  setForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; dept: string; subject: string; isHOD: boolean }>>;
  addStaff: () => void; paginatedData: StaffMember[];
  toggleStatus: (id: string, name: string, current: string) => void; 
  toggleHOD: (id: string, name: string, dept: string) => void; 
  deleteStaff: (id: string, name: string) => void;
  currentPage: number; totalPages: number; setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  search: string; setSearch: (s: string) => void; deptFilter: string; setDeptFilter: (d: string) => void;
}

const StaffDirectory: React.FC<StaffDirectoryProps> = (props) => (
  <>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{props.filteredCount} total</p>
        <div style={{ height: 16, width: 1, background: 'var(--surface-border)' }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ padding: '4px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', border: '1px solid var(--surface-border)' }}>Import CSV</button>
          <button style={{ padding: '4px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', border: '1px solid var(--surface-border)' }}>Export data</button>
        </div>
      </div>
      <button className="btn-primary" onClick={() => props.setShowAddForm(!props.showAddForm)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {props.showAddForm ? <X size={17} /> : <Plus size={17} />}
        {props.showAddForm ? 'Cancel' : 'Add Staff'}
      </button>
    </div>

    {props.showAddForm && (
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid var(--primary)' }}>
        <h4 style={{ marginBottom: '1rem', fontWeight: 700 }}>New Staff Member</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.75rem' }}>
          <div><label style={lbl}>Full Name</label><input placeholder="Dr. Full Name" value={props.form.name} onChange={e => props.setForm(f => ({ ...f, name: e.target.value }))} style={{ marginBottom: 0 }} /></div>
          <div><label style={lbl}>Email</label><input type="email" placeholder="name@college.edu" value={props.form.email} onChange={e => props.setForm(f => ({ ...f, email: e.target.value }))} style={{ marginBottom: 0 }} /></div>
          <div><label style={lbl}>Department</label><select value={props.form.dept} onChange={e => props.setForm(f => ({ ...f, dept: e.target.value }))} style={{ marginBottom: 0 }}>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></div>
          <div><label style={lbl}>Subject</label><input placeholder="e.g. Machine Learning" value={props.form.subject} onChange={e => props.setForm(f => ({ ...f, subject: e.target.value }))} style={{ marginBottom: 0 }} /></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}><input type="checkbox" checked={props.form.isHOD} onChange={e => props.setForm(f => ({ ...f, isHOD: e.target.checked }))} style={{ width: 'auto', marginBottom: 0 }} /> Assign as HOD</label>
          <button className="btn-primary" onClick={props.addStaff} style={{ padding: '9px 20px', display: 'flex', alignItems: 'center', gap: 6 }}><Check size={16} /> Save Member</button>
        </div>
      </div>
    )}

    <FilterBar search={props.search} setSearch={props.setSearch} deptFilter={props.deptFilter} setDeptFilter={props.setDeptFilter} />

    <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ borderBottom: '1px solid var(--surface-border)' }}>{['Name', 'Department', 'Subject', 'Role', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
        <tbody>
          {props.paginatedData.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid var(--surface-border)', transition: 'background .15s' }}>
              <td style={tdStyle}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 4, background: 'var(--background)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: 'var(--primary)' }}>{s.name[0]}</div><div><p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.name}</p><p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{s.email}</p></div></div></td>
              <td style={tdStyle}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.dept}</span></td>
              <td style={tdStyle}><span style={{ fontSize: '0.85rem' }}>{s.subject}</span></td>
              <td style={tdStyle}>{s.isHOD ? <Badge text="HOD" color="var(--primary)" /> : <Badge text="Staff" color="var(--text-muted)" />}</td>
              <td style={tdStyle}><button onClick={() => props.toggleStatus(s.id, s.name, s.status)} style={{ background: 'transparent', color: s.status === 'active' ? 'var(--success)' : 'var(--error)', fontSize: '0.82rem', fontWeight: 600 }}>{s.status.toUpperCase()}</button></td>
              <td style={tdStyle}><div style={{ display: 'flex', gap: 6 }}><button onClick={() => props.toggleHOD(s.id, s.name, s.dept)} style={{ padding: '4px 8px', borderRadius: 4, fontSize: '0.72rem', border: '1px solid #ddd' }}>{s.isHOD?'Revoke':'Set HOD'}</button><button onClick={() => props.deleteStaff(s.id, s.name)} style={{ color: 'var(--error)' }}><Trash2 size={13} /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {props.totalPages > 1 && (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Page {props.currentPage} of {props.totalPages}</p>
        <div style={{ display: 'flex', gap: 5 }}>
          <button disabled={props.currentPage === 1} onClick={() => props.setCurrentPage(p => p - 1)}>Prev</button>
          <button disabled={props.currentPage === props.totalPages} onClick={() => props.setCurrentPage(p => p + 1)}>Next</button>
        </div>
      </div>
    )}
  </>
);

const HODAssignment: React.FC<{ staff: StaffMember[]; toggleHOD: (id: string, name: string, dept: string) => void }> = ({ staff, toggleHOD }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem', padding: '1rem' }}>
    {DEPARTMENTS.map(dept => {
      const deptStaff = staff.filter(s => s.dept === dept);
      const hod = deptStaff.find(s => s.isHOD);
      return (
        <div key={dept} className="glass-card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>{dept}</h4>
          {hod ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem', background: 'rgba(99,102,241,0.05)', padding: '0.75rem', borderRadius: 8 }}>
              <Star size={16} color="#6366f1" fill="#6366f1" />
              <div><p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{hod.name}</p><p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Current HOD</p></div>
            </div>
          ) : <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginBottom: '1rem' }}>No HOD Assigned</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {deptStaff.filter(s => !s.isHOD).map(s => (
              <button key={s.id} onClick={() => toggleHOD(s.id, s.name, dept)} style={{ padding: '6px 10px', fontSize: '0.75rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', borderRadius: 6 }}>Set {s.name} as HOD</button>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

interface AnalyticsProps { staff: StaffMember[]; totalActive: number; totalHODs: number; totalFeedbacks: number; deptStats: { dept: string; count: number; hod: string }[] }
const AnalyticsPage: React.FC<AnalyticsProps> = (props) => (
  <div className="animate-fade">
    <header style={{ marginBottom: '2rem' }}><h2 style={{ fontSize: '2rem', fontWeight: 800 }}>System Analytics</h2></header>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
      {[
        { label: 'Total Staff', value: props.staff.length, color: '#6366f1' },
        { label: 'HODs', value: props.totalHODs, color: '#10b981' },
      ].map(k => (
        <div key={k.label} className="glass-card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: k.color }}>{k.value}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{k.label}</p>
        </div>
      ))}
    </div>
  </div>
);

interface FeedbackFormsProps {
  forms: FeedbackForm[]; setShowFormBuilder: React.Dispatch<React.SetStateAction<boolean>>; showFormBuilder: boolean;
  setViewingForm: React.Dispatch<React.SetStateAction<FeedbackForm | null>>; toggleFormStatus: (id: string, t: string, c: string) => void; deleteForm: (id: string, t: string) => void;
  newForm: { title: string; description: string; audience: AudienceKey[]; questions: string[] };
  setNewForm: React.Dispatch<React.SetStateAction<{ title: string; description: string; audience: AudienceKey[]; questions: string[] }>>;
  toggleAudience: (k: AudienceKey) => void; updateQuestion: (i: number, v: string) => void;
  addQuestion: () => void; removeQuestion: (i: number) => void; publishForm: () => void;
}

const FeedbackFormsPageContent: React.FC<FeedbackFormsProps> = (props) => (
  <div className="animate-fade">
    <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}><h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Forms</h2><button className="btn-primary" onClick={() => props.setShowFormBuilder(!props.showFormBuilder)}>Create New</button></header>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {props.forms.map(f => (
        <div key={f.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h4 style={{ fontWeight: 700 }}>{f.title}</h4><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.audience.join(', ')}</p></div>
          <div style={{ display: 'flex', gap: 10 }}><button onClick={() => props.setViewingForm(f)}>View</button><button onClick={() => props.deleteForm(f.id, f.title)} style={{ color: 'var(--error)' }}>Delete</button></div>
        </div>
      ))}
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────── */
/*                    ADMIN DASHBOARD                             */
/* ────────────────────────────────────────────────────────────── */

const AdminDashboard: React.FC = () => {
  const { page } = useAdminNav();
  const { showToast } = useNotification();

  const [staff, setStaff] = useState<StaffMember[]>(SEED);
  const [deptFilter, setDeptFilter] = useState('All');
  const [search, setSearch]   = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [staffSubTab, setStaffSubTab] = useState<'directory' | 'hod'>('directory');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const [form, setForm] = useState({ name: '', email: '', dept: DEPARTMENTS[0], subject: '', isHOD: false });
  const [forms, setForms] = useState<FeedbackForm[]>(SEED_FORMS);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [viewingForm, setViewingForm] = useState<FeedbackForm | null>(null);
  const [newForm, setNewForm] = useState({ title: '', description: '', audience: [] as AudienceKey[], questions: [''] });

  const filtered = useMemo(() => staff.filter(s => {
    const matchDept = deptFilter === 'All' || s.dept === deptFilter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  }), [staff, deptFilter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filtered, currentPage]);

  const totalActive = staff.filter(s => s.status === 'active').length;
  const totalHODs = staff.filter(s => s.isHOD).length;
  const deptStats = DEPARTMENTS.map(d => ({ dept: d, count: staff.filter(s => s.dept === d).length, hod: staff.find(s => s.dept === d && s.isHOD)?.name || '—' }));

  const toggleHOD = (id: string, name: string, dept: string) => {
    setStaff(prev => prev.map(s => s.dept === dept ? { ...s, isHOD: s.id === id } : s));
    showToast(`${name} assigned as HOD of ${dept}`, 'success');
  };
  const deleteStaff = (id: string, name: string) => { setStaff(prev => prev.filter(s => s.id !== id)); showToast(`${name} removed`, 'info'); };
  const toggleStatus = (id: string, name: string, cur: string) => { setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s)); showToast(`${name} status updated`, 'info'); console.log(cur); };
  const addStaff = () => { setStaff(prev => [{ ...form, id: Date.now().toString(), status: 'active' }, ...prev]); setShowAddForm(false); showToast(`Added ${form.name}`, 'success'); };

  const publishForm = () => { setForms(prev => [{ ...newForm, id: Date.now().toString(), createdAt: '2026-04-20', status: 'active', responses: 0 }, ...prev]); setShowFormBuilder(false); showToast('Form Published', 'success'); };
  const toggleFormStatus = (id: string, t: string, c: string) => { showToast(`${t} status updated`, 'info'); console.log(id, c); };
  const deleteForm = (id: string, t: string) => { setForms(prev => prev.filter(f => f.id !== id)); showToast(`Deleted ${t}`, 'info'); };

  if (page === 'analytics') return <AnalyticsPage staff={staff} totalActive={totalActive} totalHODs={totalHODs} totalFeedbacks={138} deptStats={deptStats} />;
  
  if (page === 'feedback-forms') return (
    <>
      <FeedbackFormsPageContent 
        forms={forms} setShowFormBuilder={setShowFormBuilder} showFormBuilder={showFormBuilder} setViewingForm={setViewingForm} 
        newForm={newForm} setNewForm={setNewForm} toggleAudience={(k)=>setNewForm(f=>({...f, audience: f.audience.includes(k)? f.audience.filter(a=>a!==k):[...f.audience, k]}))} 
        updateQuestion={(i,v)=>setNewForm(f=>{const q=[...f.questions];q[i]=v;return {...f,questions:q}})} 
        addQuestion={()=>setNewForm(f=>({...f,questions:[...f.questions,'']}))} 
        removeQuestion={(i)=>setNewForm(f=>({...f,questions:f.questions.filter((_,idx)=>idx!==i)}))} 
        publishForm={publishForm} toggleFormStatus={toggleFormStatus} deleteForm={deleteForm} 
      />
      {viewingForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setViewingForm(null)}>
          <div className="glass-card" style={{ maxWidth: 500, width: '90%', padding: '2rem', border: '1px solid var(--primary)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between'}} ><h3>{viewingForm.title}</h3><X onClick={()=>setViewingForm(null)} style={{cursor:'pointer'}} /></div>
            <p>{viewingForm.description}</p>
            <ul>{viewingForm.questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '2rem' }}><h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Staff Management</h2></header>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
        <button onClick={() => setStaffSubTab('directory')} style={{ padding: '10px 20px', borderRadius: 10, background: staffSubTab === 'directory' ? 'rgba(99,102,241,0.1)' : 'transparent', color: staffSubTab === 'directory' ? '#6366f1' : 'var(--text-muted)' }}>Directory</button>
        <button onClick={() => setStaffSubTab('hod')} style={{ padding: '10px 20px', borderRadius: 10, background: staffSubTab === 'hod' ? 'rgba(99,102,241,0.1)' : 'transparent', color: staffSubTab === 'hod' ? '#6366f1' : 'var(--text-muted)' }}>HODs</button>
      </div>
      <div className="glass-card">
        {staffSubTab === 'directory' 
          ? <StaffDirectory filteredCount={filtered.length} showAddForm={showAddForm} setShowAddForm={setShowAddForm} form={form} setForm={setForm} addStaff={addStaff} paginatedData={paginatedData} toggleStatus={toggleStatus} toggleHOD={toggleHOD} deleteStaff={deleteStaff} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} search={search} setSearch={setSearch} deptFilter={deptFilter} setDeptFilter={setDeptFilter} /> 
          : <HODAssignment staff={staff} toggleHOD={toggleHOD} />
        }
      </div>
    </div>
  );
};

export default AdminDashboard;
