import React, { useState, useEffect, useMemo } from 'react';
import { Search, FileText, User, Settings, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../../context/MenuContext';
import v1IA from '../../data/v1-ia.json';
import v2IA from '../../data/v2-ia.json';

export default function QuickSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  const navigate = useNavigate();
  const { iaVersion } = useMenu();

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

  // Extract all searchable pages
  const allPages = useMemo(() => {
    const rawModules = iaVersion === 2 ? v2IA.navigation : v1IA.navigation;
    const pages = [];

    const traverse = (items, moduleName) => {
      if (!items) return;
      items.forEach(item => {
        if (item.type === 'page') {
          pages.push({
            id: item.id,
            name: item.name || item.module,
            desc: moduleName,
            icon: FileText,
            color: '#3b82f6'
          });
        }
        if (item.items) {
          traverse(item.items, moduleName);
        }
      });
    };

    rawModules.forEach(mod => traverse(mod.items, mod.module || mod.name));
    return pages;
  }, [iaVersion]);

  // Filter based on query
  const filteredPages = useMemo(() => {
    if (!query.trim()) {
      // Default suggested actions when query is empty
      return [
        { id: 'employee-master', name: 'Add New Employee', desc: 'Employee', icon: User, color: '#3b82f6' },
        { id: 'attendance-register', name: 'Generate Attendance Report', desc: 'Reports', icon: FileText, color: '#10b981' },
        { id: 'leave-policy', name: 'Configure Leave Policies', desc: 'Administration', icon: Settings, color: '#f59e0b' },
      ];
    }
    
    const q = query.toLowerCase();
    return allPages.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.desc?.toLowerCase().includes(q)
    ).slice(0, 15); // Limit to top 15 results
  }, [query, allPages]);

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
              color: 'var(--text-main)',
              background: 'transparent'
            }}
          />
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-app)', padding: '4px 8px', borderRadius: '4px' }}>ESC</div>
        </div>

        <div className="minimal-scrollbar" style={{ padding: '16px 0', maxHeight: '400px', overflowY: 'auto' }}>
          <div style={{ padding: '0 24px 8px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {query.trim() ? 'Search Results' : 'Suggested Actions'}
          </div>
          
          {filteredPages.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              No results found for "{query}"
            </div>
          ) : (
            filteredPages.map((item, i) => {
              const Icon = item.icon || FileText;
              return (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', padding: '12px 24px', 
                  cursor: 'pointer', transition: 'background 0.2s'
                }} 
                onClick={() => {
                  navigate(`/page/${item.id}`);
                  setIsOpen(false);
                  setQuery('');
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
