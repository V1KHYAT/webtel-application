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
    
    const parts = location.pathname.split('/');
    const hubId = parts[parts.length - 1];
    
    if (hubId) {
      const activeIA = iaVersion === 2 ? v2IA : v1IA;
      
      function findName(items) {
        if (!items) return null;
        for (const item of items) {
          if (item.type === 'page' && item.id === hubId) {
            return item.name;
          }
          if (item.items) {
            const found = findName(item.items);
            if (found) return found;
          }
        }
        return null;
      }
      
      for (const mod of activeIA.navigation) {
        const found = findName(mod.items);
        if (found) return found;
      }
    }
    return 'Webtel Application';
  }, [location, iaVersion]);

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: 'var(--space-4)',
      paddingBottom: 'var(--space-2)',
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div>
        <h1 style={{ fontSize: location.pathname === '/' ? 'var(--text-xl)' : 'var(--text-lg)', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 var(--space-0-5) 0', letterSpacing: '-0.5px' }}>
          {location.pathname === '/' ? 'Good morning, Vikhyat 👋' : currentPageName}
        </h1>
        {location.pathname === '/' && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
            Here is what's happening across your organization today.
          </p>
        )}
      </div>
    </header>
  );
}
