import React from 'react';
import { User, Calendar, Building2 } from 'lucide-react';

export default function TopStatusBar() {
  return (
    <div style={{
      background: 'var(--primary-color)',
      color: '#0f172a',
      height: '40px',
      padding: '0 var(--space-8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      zIndex: 1100,
      borderBottom: '1px solid rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <User size={15} style={{ opacity: 0.8 }} />
          <span>Welcome, <strong style={{ fontWeight: 800 }}>Vikhyat</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', opacity: 0.9 }}>
          <Building2 size={15} />
          <span>Rodriguez, Schmeler and Stoltenberg</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Calendar size={15} style={{ opacity: 0.8 }} />
          <span>Financial Year</span>
        </div>
        <select style={{
          background: 'rgba(255, 255, 255, 0.5)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
          padding: '4px 8px',
          color: 'var(--text-main)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          outline: 'none',
          cursor: 'pointer'
        }}>
          <option>2026 - 2027</option>
          <option>2025 - 2026</option>
        </select>
      </div>
    </div>
  );
}
