import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from '../../context/MenuContext';
import v1IA from '../../data/v1-ia.json';
import v2IA from '../../data/v2-ia.json';
import { ChevronRight, ChevronDown, Search, Bell, Grid, User, Settings, Users, Briefcase, Calendar, CheckSquare, ShieldCheck, Banknote, PieChart, Info, LogOut } from 'lucide-react';

const getModuleDescription = (moduleName) => {
  const data = {
    "Administration": {
      title: "Administration & Setup",
      desc: "Configure global settings, organization details, and core compliance parameters to establish your company's foundation.",
      icon: <Settings size={36} color="var(--primary-color)" />,
      tip: {
        title: "Looking for Reports?",
        desc: "All configuration and operational reports have been moved to the dedicated 'Reports' tab for quicker access."
      }
    },
    "Employee": {
      title: "Employee Lifecycle",
      desc: "Manage the complete employee journey, from onboarding and master details to compliance and portal settings.",
      icon: <Users size={36} color="var(--primary-color)" />
    },
    "HR": {
      title: "Human Resources",
      desc: "Streamline operations including recruitment, performance management, training, and employee engagement.",
      icon: <Briefcase size={36} color="var(--primary-color)" />
    },
    "Attendance & Leave": {
      title: "Time & Attendance",
      desc: "Track time, manage complex shift rosters, and oversee leave policies seamlessly across all locations.",
      icon: <Calendar size={36} color="var(--primary-color)" />
    },
    "Approvals": {
      title: "Centralized Approvals",
      desc: "A unified hub for reviewing and authorizing workflows, leaves, expenses, and system changes.",
      icon: <CheckSquare size={36} color="var(--primary-color)" />
    },
    "Compliance": {
      title: "Statutory Compliance",
      desc: "Ensure strict adherence to statutory requirements, tax filings, and regulatory guidelines.",
      icon: <ShieldCheck size={36} color="var(--primary-color)" />
    },
    "Salary Processing": {
      title: "Payroll & Salary",
      desc: "Execute seamless payroll runs with automated tax deductions, reimbursements, and accurate salary disbursements.",
      icon: <Banknote size={36} color="var(--primary-color)" />,
      tip: {
        title: "Looking for Payroll Reports?",
        desc: "Salary and processing reports have been centralized. Head over to the 'Reports' tab to generate them."
      }
    },
    "Analytics": {
      title: "Interactive Analytics",
      desc: "Gain deep insights into your workforce with interactive charts, dashboards, and visual data representations.",
      icon: <PieChart size={36} color="var(--primary-color)" />
    },
    "Reports": {
      title: "Centralized Reports",
      desc: "Access, generate, and export all your operational, financial, and compliance reports from this unified hub.",
      icon: <Grid size={36} color="var(--primary-color)" />
    },
    "Others": {
      title: "Additional Utilities",
      desc: "Access miscellaneous tools, integrations, and supplementary platform features.",
      icon: <Grid size={36} color="var(--primary-color)" />
    }
  };

  return data[moduleName] || {
    title: `${moduleName} Workspace`,
    desc: "Empowering your organization with comprehensive human resource and payroll management solutions.",
    icon: <Grid size={36} color="var(--primary-color)" />
  };
};

const MegaMenuRightItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const hasChildren = item.items && item.items.length > 0;
  const isPage = item.type === 'page';

  return (
    <div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (isPage) navigate(`/page/${item.id}`);
          else if (hasChildren) setIsOpen(!isOpen);
        }}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '6px',
          background: isOpen ? 'var(--bg-hover)' : 'transparent',
          color: 'var(--text-main)',
          fontSize: '13px',
          fontWeight: isOpen ? 600 : 500,
          textDecoration: 'none',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => { if(!isOpen) e.currentTarget.style.background = 'var(--bg-hover)'; }}
        onMouseLeave={e => { if(!isOpen) e.currentTarget.style.background = 'transparent'; }}
      >
        <span>{item.name || item.module}</span>
        {hasChildren && (
           <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s', color: 'var(--text-muted)' }} />
        )}
      </a>
      {isOpen && hasChildren && (
        <div style={{ paddingLeft: '12px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: '2px solid var(--border-light)', marginLeft: '12px' }}>
          {item.items.map((child, idx) => (
            <MegaMenuRightItem key={idx} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const MegaNavbarItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [flyLeft, setFlyLeft] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);

  const hasChildren = item.items && item.items.length > 0;
  const isPage = item.type === 'page';
  const isActive = isPage && location.pathname === `/page/${item.id}`;
  const moduleInfo = getModuleDescription(item.name || item.module);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth - 20) {
        setFlyLeft(true);
      }
    } else {
      setFlyLeft(false);
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveSubItem(null);
    }, 150);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); if (isPage) navigate(`/page/${item.id}`); }}
        style={{
          display: 'flex', alignItems: 'center', padding: '8px 10px',
          color: isActive ? 'var(--primary-color)' : 'var(--text-main)',
          background: isActive ? 'var(--primary-light)' : (isOpen ? 'var(--bg-hover)' : 'transparent'),
          textDecoration: 'none', fontSize: '12px', fontWeight: 600,
          whiteSpace: 'nowrap', borderRadius: '16px', transition: 'all 0.2s ease'
        }}
      >
        <span style={{ letterSpacing: '-0.1px' }}>{item.name || item.module}</span>
      </a>

      {isOpen && hasChildren && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: flyLeft ? 'auto' : 0,
            right: flyLeft ? 0 : 'auto',
            background: '#fff',
            border: '1px solid var(--border-color)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            zIndex: 1000,
            width: '700px',
            maxHeight: '75vh',
            display: 'flex',
            overflow: 'hidden',
            minHeight: '350px'
          }}
        >
          {/* Left Column: Level 2 */}
          <div style={{ width: '40%', minHeight: 0, background: '#fafafa', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', background: '#fff', flexShrink: 0 }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{item.name || item.module}</h3>
            </div>
            <div className="minimal-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {item.items.map((sub, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveSubItem(sub)}
                  onClick={(e) => {
                    e.preventDefault();
                    if (sub.type === 'page') {
                      navigate(`/page/${sub.id}`);
                      setIsOpen(false);
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: activeSubItem === sub ? '#fff' : 'transparent',
                    boxShadow: activeSubItem === sub ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                    fontWeight: activeSubItem === sub ? 600 : 500,
                    color: activeSubItem === sub ? 'var(--primary-hover)' : 'var(--text-main)',
                    fontSize: '12.5px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {sub.name || sub.module}
                  {sub.items && sub.items.length > 0 && <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Level 3 or Branding */}
          <div className="minimal-scrollbar" style={{ width: '60%', minHeight: 0, padding: '24px', background: '#fff', position: 'relative', overflowY: 'auto' }}>
            {activeSubItem && activeSubItem.items && activeSubItem.items.length > 0 ? (
              <div>
                <h4 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }}></span>
                  {activeSubItem.name || activeSubItem.module}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {activeSubItem.items.map((child, idx) => (
                    <MegaMenuRightItem key={idx} item={child} />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  {moduleInfo.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 12px 0', textAlign: 'center' }}>{moduleInfo.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '80%', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                  {moduleInfo.desc}
                </p>
                
                {moduleInfo.tip && (
                  <div style={{ 
                    marginTop: 'auto', 
                    background: 'var(--bg-app)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'flex-start',
                    width: '90%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ background: '#fff', borderRadius: '50%', padding: '6px', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <Info size={16} color="var(--primary-hover)" />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>{moduleInfo.tip.title}</h4>
                      <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{moduleInfo.tip.desc}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TopNavbarItem = ({ item, isRoot, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [flyLeft, setFlyLeft] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);

  const hasChildren = item.items && item.items.length > 0;
  const isPage = item.type === 'page';
  const isActive = isPage && location.pathname === `/page/${item.id}`;

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth - 20) {
        setFlyLeft(true);
      }
    } else {
      setFlyLeft(false);
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (isPage) {
      navigate(`/page/${item.id}`);
      setIsOpen(false);
    } else if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          padding: isRoot ? '8px 10px' : '8px 14px',
          color: isActive ? 'var(--primary-color)' : (isRoot ? 'var(--text-main)' : 'var(--text-secondary)'),
          background: isActive ? 'var(--primary-light)' : (isOpen ? 'var(--bg-hover)' : 'transparent'),
          textDecoration: 'none',
          fontSize: isRoot ? '12px' : '12.5px',
          fontWeight: isRoot ? 600 : (isActive ? 600 : 500),
          whiteSpace: 'nowrap',
          borderRadius: isRoot ? '16px' : '0',
          transition: 'all 0.2s ease'
        }}
      >
        <span style={{ letterSpacing: '-0.1px' }}>{item.name || item.module}</span>
        {hasChildren && !isRoot && (
          <ChevronRight size={14} style={{ marginLeft: '12px', color: 'var(--text-muted)' }} />
        )}
      </a>

      {isOpen && hasChildren && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: isRoot ? 'calc(100% + 4px)' : '0',
            left: isRoot ? '0' : (flyLeft ? 'auto' : '100%'),
            right: flyLeft ? '100%' : 'auto',
            background: '#fff',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            borderRadius: '8px',
            zIndex: 1000,
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            padding: '4px',
            marginLeft: isRoot ? '0' : (flyLeft ? '-4px' : '4px')
          }}
        >
          {item.items.map((child, idx) => (
            <TopNavbarItem key={idx} item={child} isRoot={false} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TopNavbar() {
  const { iaVersion, dropdownStyle } = useMenu();
  const navigate = useNavigate();
  
  const modules = useMemo(() => {
    const rawModules = iaVersion === 2 ? v2IA.navigation : v1IA.navigation;
    const baseModules = JSON.parse(JSON.stringify(rawModules));

    const flattenSingleChild = (items) => {
      if (!items) return [];
      
      // Filter out empty categories
      const validItems = items.filter(item => item.type === 'page' || (item.items && item.items.length > 0));

      return validItems.map(item => {
        if (item.items && item.items.length > 0) {
          item.items = flattenSingleChild(item.items);
          
          if (item.items.length === 1) {
            return {
              ...item.items[0],
              name: item.name || item.items[0].name
            };
          }
        }
        return item;
      });
    };

    return baseModules.map(mod => ({
      ...mod,
      items: flattenSingleChild(mod.items)
    })).filter(mod => mod.items && mod.items.length > 0);
  }, [iaVersion]);

  return (
    <div style={{
      width: '100%',
      padding: 'var(--space-2) var(--space-6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      position: 'relative'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%', 
        maxWidth: '1440px', 
        gap: 'var(--space-2)' 
      }}>
        {/* Pill 1: Brand Logo */}
        <div 
          style={{ 
            background: '#fff',
            padding: '0 var(--space-2)', 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            borderRadius: 'var(--radius-lg)',
            height: 'var(--space-6)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color)',
            flexShrink: 0
          }}
          onClick={() => navigate('/')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'var(--primary-color)',
              color: '#0f172a',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px',
              boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.1)'
            }}>W</div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>Webtel</span>
          </div>
        </div>

        {/* Pill 2: Navigation Modules */}
        <div style={{ 
          display: 'flex', 
          flex: 1, 
          flexWrap: 'nowrap', 
          padding: 'var(--space-0-5) 6px',
          height: 'var(--space-6)',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color)',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-0-5)',
          overflowX: 'visible'
        }}>
          {modules.map((mod, idx) => (
            dropdownStyle === 'mega' ? (
              <MegaNavbarItem key={idx} item={mod} />
            ) : (
              <TopNavbarItem key={idx} item={mod} isRoot={true} />
            )
          ))}
        </div>

        {/* Pill 3: Right Tools */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)', 
          height: 'var(--space-6)', 
          flexShrink: 0
        }}>
          <div 
            onClick={() => window.dispatchEvent(new CustomEvent('open-quick-search'))}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: '#fff', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-lg)',
              padding: '0 var(--space-2)',
              height: 'var(--space-6)',
              width: '260px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              cursor: 'text',
              gap: 'var(--space-1)'
            }}>
            <Search size={16} color="var(--text-muted)" />
            <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: '13px' }}>Search anything...</span>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2px', 
              background: 'var(--bg-app)', 
              padding: '4px 8px', 
              borderRadius: '6px',
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 600,
              border: '1px solid var(--border-light)'
            }}>
              Ctrl K
            </div>
          </div>

          <div style={{ 
            padding: '0 var(--space-2)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-2)', 
            height: 'var(--space-6)', 
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color)'
          }}>
            <Bell size={16} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
            <div style={{ width: '1px', height: '16px', background: 'var(--border-light)' }}></div>
            <LogOut size={16} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
