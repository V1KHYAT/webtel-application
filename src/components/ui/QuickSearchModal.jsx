import React, { useState, useEffect } from 'react';
import { Search, Command, FileText, User, Settings, ArrowRight } from 'lucide-react';

export default function QuickSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    const openSearch = () => setIsOpen(true);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-quick-search', openSearch);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-quick-search', openSearch);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '15vh'
    }} onClick={() => setIsOpen(false)}>
      <div style={{
        background: '#fff',
        width: '600px',
        borderRadius: '16px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
          <Search size={20} color="var(--primary-color)" />
          <input 
            autoFocus
            type="text"
            placeholder="Search employees, reports, or settings..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              padding: '0 16px',
              fontSize: '18px',
              color: 'var(--text-main)'
            }}
          />
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-app)', padding: '4px 8px', borderRadius: '4px' }}>ESC</div>
        </div>

        <div style={{ padding: '16px 0', maxHeight: '400px', overflowY: 'auto' }}>
          <div style={{ padding: '0 24px 8px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Suggested Actions
          </div>
          
          {[
            { icon: User, label: 'Add New Employee', desc: 'Employee Master', color: '#3b82f6' },
            { icon: FileText, label: 'Generate Attendance Report', desc: 'Reports', color: '#10b981' },
            { icon: Settings, label: 'Configure Leave Policies', desc: 'Administration', color: '#f59e0b' },
          ].map((item, i) => (
            <div key={i} style={{ 
              display: 'flex', alignItems: 'center', padding: '12px 24px', 
              cursor: 'pointer', transition: 'background 0.2s'
            }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                <item.icon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
