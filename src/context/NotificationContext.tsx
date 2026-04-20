/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/purity */
import React, { createContext, useContext, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface NotificationContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 10000 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '8px',
              background: 'white',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: '300px',
              maxWidth: '450px',
              borderLeft: `4px solid ${
                toast.type === 'success' ? 'var(--success)' : 
                toast.type === 'error' ? 'var(--error)' : 
                toast.type === 'info' ? 'var(--primary)' : 'var(--warning)'
              }`,
              animation: 'fadeInSlide 0.3s ease-out forwards'
            }}
          >
            <div style={{ color: 
                toast.type === 'success' ? 'var(--success)' : 
                toast.type === 'error' ? 'var(--error)' : 
                toast.type === 'info' ? 'var(--primary)' : 'var(--warning)'
            }}>
              {toast.type === 'success' && <CheckCircle2 size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
              {toast.type === 'warning' && <AlertCircle size={20} />}
            </div>
            <p style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
