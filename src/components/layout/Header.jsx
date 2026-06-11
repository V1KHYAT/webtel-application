import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';

export default function Header() {
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
          Welcome Back, Vikhyat!
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
