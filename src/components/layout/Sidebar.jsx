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
  "Additional Tools": Grid,
  "Approvals": CheckSquare,
  "Compliance": FileWarning,
  "Analytics": PieChart,
  "Reports": BarChart3
};

const SidebarItem = ({ item, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isPage = item.type === 'page';
  const hasChildren = item.items && item.items.length > 0;
  const isActive = isPage && location.pathname === `/page/${item.id}`;

  const handleClick = (e) => {
    e.preventDefault();
    if (isPage) {
      navigate(`/page/${item.id}`);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div style={{ marginTop: depth === 0 ? '4px' : '2px' }}>
      <a
        href="#"
        onClick={handleClick}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `6px 12px 6px ${12 + depth * 12}px`,
          fontSize: depth === 0 ? '13px' : '12px',
          fontWeight: depth === 0 ? 600 : (isActive ? 600 : 500),
          color: isActive ? 'var(--primary-color)' : 'var(--text-main)',
          background: isActive ? 'var(--primary-light)' : (isOpen && depth === 0 ? 'var(--bg-hover)' : 'transparent'),
          textDecoration: 'none',
          borderRadius: 'var(--radius-sm)',
          transition: 'background 0.15s, color 0.15s'
        }}
        onMouseEnter={e => {
          if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)';
        }}
        onMouseLeave={e => {
          if (!isActive) e.currentTarget.style.background = (isOpen && depth === 0 ? 'var(--bg-hover)' : 'transparent');
        }}
      >
        <span style={{ lineHeight: '1.4' }}>{item.name || item.module}</span>
        {hasChildren && (isOpen ? <ChevronDown size={14} style={{flexShrink:0}}/> : <ChevronRight size={14} style={{flexShrink:0}}/>)}
      </a>
      
      {isOpen && hasChildren && (
        <div style={{ paddingLeft: '4px' }}>
          {item.items.map((child, idx) => (
            <SidebarItem key={idx} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const { iaVersion } = useMenu();
  const navigate = useNavigate();

  const modules = useMemo(() => {
    if (iaVersion === 2) return v2IA.navigation;
    return v1IA.navigation;
  }, [iaVersion]);

  return (
    <div className="sidebar-column" style={{ position: 'relative' }}>
      <div className="notion-sidebar">
        <div style={{ padding: '16px', background: 'var(--primary-color)', borderBottom: '1px solid var(--border-light)', marginBottom: '8px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', marginBottom: '8px',
                  background: 'transparent', border: 'none', borderRadius: '6px',
                  cursor: 'pointer', color: 'var(--text-main)', fontSize: '13px', fontWeight: 600,
                  width: '100%', textAlign: 'left', transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Home size={16} color="var(--primary-color)" />
                <span>Home</span>
              </button>
              
              {modules.map((mod, idx) => (
                <SidebarItem key={idx} item={mod} depth={0} />
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}