import React, { useMemo } from 'react';
import { Bell, Settings, LogOut, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import v1IA from '../../data/v1-ia.json';
import v2IA from '../../data/v2-ia.json';
import { useMenu } from '../../context/MenuContext';

export default function Header() {
  const location = useLocation();
  const { iaVersion } = useMenu();
  
  const currentPageName = useMemo(() => {
    if (location.pathname === '/') return 'Dashboard';
    
    // Attempt to extract hubId from pathname if useParams doesn't catch it deeply
    const parts = location.pathname.split('/');
    const hubId = parts[parts.length - 1];
    
    if (hubId) {
      const activeIA = iaVersion === 2 ? v2IA : v1IA;
      for (const mod of activeIA.navigation) {
        if (!mod.categories) continue;
        for (const cat of mod.categories) {
          const page = cat.pages?.find(p => p.id === hubId);
          if (page) return page.name;
        }
      }
    }
    return 'Webtel Application';
  }, [location, iaVersion]);

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
