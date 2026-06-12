import React, { useMemo } from 'react';
import { Bell, Settings, LogOut, Search } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import v1IA from '../../data/v1-ia.json';

export default function Header() {
  const location = useLocation();
  
  const currentPageName = useMemo(() => {
    if (location.pathname === '/') return 'Dashboard';
    
    // Attempt to extract hubId from pathname if useParams doesn't catch it deeply
    const parts = location.pathname.split('/');
    const hubId = parts[parts.length - 1];
    
    if (hubId) {
      for (const mod of v1IA.navigation) {
        if (!mod.categories) continue;
        for (const cat of mod.categories) {
          const page = cat.pages?.find(p => p.id === hubId);
          if (page) return page.name;
        }
      }
    }
    return 'Webtel Application';
  }, [location]);

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '32px',
      paddingBottom: '16px',
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>
          {currentPageName}
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'var(--bg-light)', 
          padding: '8px 16px', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          width: '300px'
        }}>
          <Search size={16} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: 'var(--text-main)' }} 
          />
        </div>
        
        <button className="btn-ghost" style={{ padding: '8px' }}>
          <Bell size={18} />
        </button>
        <button className="btn-ghost" style={{ padding: '8px' }}>
          <Settings size={18} />
        </button>
        <button className="btn-ghost" style={{ padding: '8px', color: 'var(--accent-red)' }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
