import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from '../../context/MenuContext';
import v1IA from '../../data/v1-ia.json';
import v2IA from '../../data/v2-ia.json';
import { ChevronRight } from 'lucide-react';

const TopNavbarItem = ({ item, isRoot }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hasChildren = item.type === 'category' && item.items && item.items.length > 0;
  const isPage = item.type === 'page';

  const handleClick = (e) => {
    e.preventDefault();
    if (isPage) {
      navigate(`/page/${item.id}`);
      setIsOpen(false);
    }
  };

  const isActive = isPage && location.pathname === `/page/${item.id}`;

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{
        position: 'relative',
        display: isRoot ? 'inline-block' : 'block'
      }}
    >
      <a
        href="#"
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isRoot ? '12px 16px' : '8px 16px',
          color: isActive ? 'var(--primary-color)' : (isRoot ? '#fff' : 'var(--text-main)'),
          background: isActive ? 'var(--primary-light)' : (isOpen ? (isRoot ? 'rgba(255,255,255,0.2)' : 'var(--bg-hover)') : 'transparent'),
          textDecoration: 'none',
          fontSize: isRoot ? '14px' : '13px',
          fontWeight: isRoot ? 600 : 500,
          textTransform: isRoot ? 'uppercase' : 'none',
          whiteSpace: 'nowrap',
          borderBottom: isRoot ? 'none' : '1px solid var(--border-light)'
        }}
      >
        <span>{item.name || item.module}</span>
        {hasChildren && !isRoot && <ChevronRight size={14} style={{ marginLeft: '12px', color: 'var(--text-secondary)' }} />}
      </a>

      {isOpen && hasChildren && (
        <div
          style={{
            position: 'absolute',
            top: isRoot ? '100%' : '0',
            left: isRoot ? '0' : '100%',
            background: '#fff',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '220px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {item.items.map((child, idx) => (
            <TopNavbarItem key={idx} item={child} isRoot={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TopNavbar() {
  const { iaVersion } = useMenu();
  
  const modules = useMemo(() => {
    if (iaVersion === 2) return v2IA.navigation;
    return v1IA.navigation;
  }, [iaVersion]);

  return (
    <div style={{
      width: '100%',
      background: 'var(--primary-color)',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      zIndex: 1000,
      position: 'relative'
    }}>
      {modules.map((mod, idx) => (
        <TopNavbarItem key={idx} item={mod} isRoot={true} />
      ))}
    </div>
  );
}
