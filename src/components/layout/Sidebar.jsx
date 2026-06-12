import React, { useState, useMemo } from 'react';
import { 
  Building2, Users, Monitor, Calendar, UserCog,
  CheckSquare, FileWarning, BadgeDollarSign, 
  PieChart, Grip, Plane, Target, GraduationCap, 
  Briefcase, UserPlus, ChevronRight, ChevronDown, Home,
  FileUp, Settings as SettingsIcon, Database, Clock, CreditCard, TrendingUp, Receipt, BarChart3,
  Search, ChevronLeft, Banknote, BookOpen, Heart, UserMinus, Shield, Grid
} from 'lucide-react';
import v1IA from '../../data/v1-ia.json';
import v2IA from '../../data/v2-ia.json';
import { useMenu } from '../../context/MenuContext';
import { useNavigate, useLocation } from 'react-router-dom';

const iconMapV1 = {
  "Administration": Building2,
  "Employee": Users,
  "Asset": Monitor,
  "HR": UserCog,
  "Attendance & Leave": Clock,
  "Approvals": CheckSquare,
  "Compliance": FileWarning,
  "Salary Processing": BadgeDollarSign,
  "Analytics": PieChart,
  "Others": Grip,
  "Travel": Plane,
  "PMS": Target,
  "Training": GraduationCap,
  "e-Recruitment": Briefcase,
  "Onboarding": UserPlus,
  "Reports": BarChart3
};



const iconMapV2 = {
  "System & Org Setup": SettingsIcon,
  "Employee Records": Users,
  "Recruitment (ATS)": Briefcase,
  "Time & Attendance": Clock,
  "Payroll Management": Banknote,
  "Expenses & Claims": Receipt,
  "Performance Appraisals": Target,
  "Learning & Development": BookOpen,
  "HR Operations": Heart,
  "Loans & Advances": CreditCard,
  "Offboarding": UserMinus,
  "Tax & Compliance (TDS)": Shield,
  "Additional Tools": Grid
,
  "Approvals": CheckSquare,
  "Compliance": FileWarning,
  "Analytics": PieChart,
  "Reports": BarChart3
};

// Custom nested menu for V2 (Category -> Pages)
const NestedMenuItemPages = ({ category }) => {
  const hasPages = category.pages && category.pages.length > 0;
  const navigate = useNavigate();
  const location = useLocation();
  const isActiveCategory = hasPages && category.pages.some(p => location.pathname === `/page/${p.id}`);
  const [isOpen, setIsOpen] = useState(isActiveCategory);
  
  React.useEffect(() => {
    if (isActiveCategory) {
      setIsOpen(true);
    }
  }, [isActiveCategory]);
  
  return (
    <div style={{ marginTop: '2px' }}>
      <a 
        href="#" 
        onClick={(e) => { 
          e.preventDefault(); 
          if (hasPages) setIsOpen(!isOpen); 
        }}
        style={{ 
          fontSize: '12px', 
          fontWeight: 600, 
          padding: '6px 10px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: 'var(--text-main)',
          background: isOpen ? 'var(--bg-hover)' : 'transparent',
          borderRadius: 'var(--radius-sm)',
          textDecoration: 'none'
        }}
      >
        <span>{category.name}</span>
        {hasPages && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
      </a>
      {isOpen && hasPages && (
        <div style={{ paddingLeft: '12px', marginTop: '4px' }}>
          {category.pages.map((page) => (
            <a 
              key={page.id}
              href="#"
              title={page.mergedFrom ? `Merged from: \n- ${page.mergedFrom.join('\n- ')}` : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/page/${page.id}`);
              }}
              style={{ 
                fontSize: '11px', 
                padding: '6px 10px', 
                display: 'block', 
                color: location.pathname === `/page/${page.id}` ? 'var(--primary-color)' : 'var(--text-secondary)',
                background: location.pathname === `/page/${page.id}` 
                  ? 'var(--primary-light)' 
                  : (page.mergedFrom ? 'rgba(250, 204, 21, 0.15)' : 'transparent'),
                fontWeight: location.pathname === `/page/${page.id}` ? 600 : 500,
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                marginBottom: '4px',
                border: page.mergedFrom ? '1px solid rgba(250, 204, 21, 0.3)' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== `/page/${page.id}`) {
                  e.currentTarget.style.color = 'var(--primary-color)';
                  e.currentTarget.style.background = page.mergedFrom ? 'rgba(250, 204, 21, 0.3)' : 'var(--primary-subtle)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== `/page/${page.id}`) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = page.mergedFrom ? 'rgba(250, 204, 21, 0.15)' : 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{page.name}</span>
                {page.mergedFrom && (
                  <span style={{ 
                    fontSize: '9px', 
                    background: '#fef08a', 
                    color: '#854d0e', 
                    padding: '2px 6px', 
                    borderRadius: '8px',
                    fontWeight: 700,
                    letterSpacing: '0.5px'
                  }}>
                    MERGED
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const V3ExpandableCategory = ({ category, isActiveCategory, location, navigate }) => {
  const [isOpen, setIsOpen] = useState(isActiveCategory);
  
  React.useEffect(() => {
    if (isActiveCategory) setIsOpen(true);
  }, [isActiveCategory]);

  return (
    <div style={{ 
      background: 'transparent', 
      border: 'none', 
      marginBottom: '2px',
      overflow: 'hidden',
      transition: 'all 0.2s'
    }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '8px 12px', 
          background: isOpen ? 'var(--bg-hover)' : 'transparent', 
          border: 'none', 
          borderRadius: '6px',
          fontWeight: 500,
          fontSize: '12px',
          color: 'var(--text-main)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.15s'
        }}
        onMouseEnter={e => { if(!isOpen) e.currentTarget.style.background = 'var(--bg-hover)' }}
        onMouseLeave={e => { if(!isOpen) e.currentTarget.style.background = 'transparent' }}
      >
        <span style={{ flex: 1, paddingRight: '8px', lineHeight: '1.4' }}>{category.name}</span>
        {isOpen ? <ChevronDown size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }}/> : <ChevronRight size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }}/>}
      </button>
      
      {isOpen && (
        <div style={{ padding: '2px 12px 6px 20px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {category.pages.map(page => (
            <a
              key={page.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/page/${page.id}`);
              }}
              style={{
                width: '100%',
                display: 'block',
                textDecoration: 'none',
                padding: '6px 10px',
                background: location.pathname === `/page/${page.id}` ? 'var(--primary-light)' : 'transparent',
                color: location.pathname === `/page/${page.id}` ? 'var(--primary-color)' : 'var(--text-secondary)',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: location.pathname === `/page/${page.id}` ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => {
                if (location.pathname !== `/page/${page.id}`) {
                  e.currentTarget.style.color = 'var(--text-main)';
                  e.currentTarget.style.background = 'var(--bg-hover)';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== `/page/${page.id}`) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {page.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};


export default function Sidebar() {
  const [expandedModule, setExpandedModule] = useState(null);
  const [v3ActiveModule, setV3ActiveModule] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { iaVersion } = useMenu();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current modules based on version
  const modules = useMemo(() => {
    if (iaVersion === 2) return v2IA.navigation;
    return v1IA.navigation;
  }, [iaVersion]);

  // Auto-expand module if it contains the active page
  React.useEffect(() => {
    if (location.pathname.startsWith('/page/')) {
      const currentId = location.pathname.split('/page/')[1];
      for (const mod of modules) {
        if (!mod.categories) continue;
        for (const cat of mod.categories) {
          if (cat.pages?.some(p => p.id === currentId)) {
            setExpandedModule(mod.module);
            return;
          }
        }
      }
    } else if (location.pathname === '/') {
      setExpandedModule(null);
    }
  }, [location.pathname, modules]);

  const currentIconMap = iaVersion === 2 ? iconMapV2 : iconMapV1;

  return (
    <div className="sidebar-column" style={{ position: 'relative' }}>
      
      {/* AB Test Badge Removed */}

      <div className="notion-sidebar">
        
          <div style={{ padding: '16px 16px 8px 16px', background: 'var(--primary-color)', borderBottom: '1px solid var(--border-light)', marginBottom: '8px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search Webtel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '6px', border: 'none', fontSize: '13px', background: '#fff' }}
              />
            </div>
          </div>
        
                <nav className="notion-nav">
          {!v3ActiveModule ? (
            /* Home View */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflowY: 'hidden', padding: '0 12px', paddingBottom: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', justifyContent: 'center' }}>
                  
                  {/* Home Full Width Button */}
                  <button
                    onClick={() => { setV3ActiveModule(null); navigate('/'); }}
                    style={{
                      gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 14px', marginBottom: '4px',
                      background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: '8px',
                      cursor: 'pointer', color: 'var(--text-main)', fontSize: '12px', fontWeight: 500,
                      transition: 'all 0.2s', width: '100%', boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.background = 'var(--primary-subtle)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-light)'; }}
                  >
                    <Home size={16} color="var(--primary-color)" />
                    <span>Home</span>
                  </button>
                  {modules.map(mod => {
                    const moduleNameLower = mod.module.toLowerCase();
                    const iconKey = Object.keys(currentIconMap).find(k => k.toLowerCase() === moduleNameLower);
                    const Icon = iconKey ? currentIconMap[iconKey] : Grip;
                    return (
                      <button
                        key={mod.module}
                        onClick={() => setV3ActiveModule(mod)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 6px',
                          background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: '8px',
                          cursor: 'pointer', textAlign: 'center', color: 'var(--text-main)', fontSize: '11px', fontWeight: 500,
                          transition: 'all 0.2s', width: '100%', height: '80px', boxSizing: 'border-box'
                        }}
                        onMouseEnter={(e) => { 
                          e.currentTarget.style.borderColor = 'var(--primary-color)';
                          e.currentTarget.style.background = 'var(--primary-subtle)';
                        }}
                        onMouseLeave={(e) => { 
                          e.currentTarget.style.borderColor = 'var(--border-light)';
                          e.currentTarget.style.background = 'var(--bg-light)';
                        }}
                      >
                        <Icon size={20} color="var(--primary-color)" />
                        <span style={{ lineHeight: '1.2' }}>{mod.module}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Module View */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '0 12px 12px 12px', borderBottom: '1px solid var(--border-light)', marginBottom: '8px' }}>
                <button 
                  onClick={() => setV3ActiveModule(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, padding: '4px 0' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--text-main)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}
                >
                  <ChevronLeft size={14} /> Back
                </button>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginTop: '8px' }}>
                  {v3ActiveModule.module}
                </h3>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
                {v3ActiveModule.categories && v3ActiveModule.categories.map((cat, idx) => {
                  if (cat.pages && cat.pages.length === 1) {
                    const page = cat.pages[0];
                    return (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/page/${page.id}`);
                        }}
                        style={{ 
                          width: '100%',
                          display: 'block',
                          padding: '8px 12px',
                          background: location.pathname === `/page/${page.id}` ? 'var(--primary-light)' : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          marginBottom: '2px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: location.pathname === `/page/${page.id}` ? 'var(--primary-color)' : 'var(--text-main)',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = location.pathname === `/page/${page.id}` ? 'var(--primary-light)' : 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = location.pathname === `/page/${page.id}` ? 'var(--primary-light)' : 'transparent'}
                      >
                        {page.name}
                      </button>
                    );
                  }
                  
                  // Button that expands to show content under it
                  const hasPages = cat.pages && cat.pages.length > 0;
                  const isActiveCategory = hasPages && cat.pages.some(p => location.pathname === `/page/${p.id}`);
                  
                  return (
                    <V3ExpandableCategory 
                      key={idx} 
                      category={cat} 
                      isActiveCategory={isActiveCategory} 
                      location={location} 
                      navigate={navigate} 
                    />
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}