import React, { useState, useMemo } from 'react';
import { 
  Building2, Users, Monitor, Calendar, UserCog,
  CheckSquare, FileWarning, BadgeDollarSign, 
  PieChart, Grip, Plane, Target, GraduationCap, 
  Briefcase, UserPlus, ChevronRight, ChevronDown, Home,
  FileUp, Settings as SettingsIcon, Database, Clock, CreditCard, TrendingUp, Receipt, BarChart3,
  Search, ChevronLeft, Banknote, BookOpen, Heart, UserMinus, Shield, Grid, Bell, Menu
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

const SidebarItem = ({ item, depth = 0, iaVersion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isPage = item.type === 'page';
  const hasChildren = item.items && item.items.length > 0;
  const isActive = isPage && location.pathname === `/page/${item.id}`;

  const Icon = depth === 0 ? (iaVersion === 2 ? iconMapV2[item.module] : iconMapV1[item.module]) || Grid : null;

  const handleClick = (e) => {
    e.preventDefault();
    if (isPage) {
      navigate(`/page/${item.id}`);
    } else {
      setIsOpen(!isOpen);
    }
  };

  if (depth === 0) {
    return (
      <div style={{ borderBottom: '1px solid var(--border-light)' }}>
        <a
          href="#"
          onClick={handleClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 20px',
            textDecoration: 'none',
            background: isOpen ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
            transition: 'background 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)'; }}
          onMouseLeave={e => { if(!isOpen) e.currentTarget.style.background = 'transparent'; }}
        >
          {Icon && <Icon size={20} style={{ color: 'var(--text-main)', marginRight: '14px', flexShrink: 0 }} strokeWidth={1.5} />}
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', letterSpacing: '-0.2px' }}>
              {item.name || item.module}
            </span>
          </div>
          {hasChildren && (
            <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          )}
        </a>
        
        {isOpen && hasChildren && (
          <div style={{ background: 'rgba(0,0,0,0.015)', borderTop: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', paddingTop: '4px' }}>
            {item.items.map((child, idx) => (
              <SidebarItem key={idx} item={child} depth={depth + 1} iaVersion={iaVersion} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Nested Items
  return (
    <div>
      <a
        href="#"
        onClick={handleClick}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `10px 20px 10px ${20 + depth * 16}px`,
          fontSize: '13.5px',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? 'var(--primary-hover)' : 'var(--text-secondary)',
          background: isActive ? 'var(--primary-light)' : 'transparent',
          textDecoration: 'none',
          transition: 'background 0.15s, color 0.15s'
        }}
        onMouseEnter={e => {
          if (!isActive) e.currentTarget.style.background = 'var(--border-light)';
        }}
        onMouseLeave={e => {
          if (!isActive) e.currentTarget.style.background = 'transparent';
        }}
      >
        <span style={{ lineHeight: '1.4' }}>{item.name || item.module}</span>
        {hasChildren && (isOpen ? <ChevronDown size={14} style={{color: 'var(--text-muted)'}}/> : <ChevronRight size={14} style={{color: 'var(--text-muted)'}}/>)}
      </a>
      
      {isOpen && hasChildren && (
        <div>
          {item.items.map((child, idx) => (
            <SidebarItem key={idx} item={child} depth={depth + 1} iaVersion={iaVersion} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const { iaVersion } = useMenu();
  const navigate = useNavigate();

  const modules = useMemo(() => {
    if (iaVersion === 2) return v2IA.navigation;
    return v1IA.navigation;
  }, [iaVersion]);

  return (
    <div className="sidebar-column" style={{ 
      width: '280px', 
      minWidth: '280px', 
      maxWidth: '280px', 
      margin: '0', 
      height: '100%', 
      background: 'rgba(255, 255, 255, 0.65)', 
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderRight: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '1px 0 24px rgba(0,0,0,0.03)',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      
      {/* Settings / Header like Paytm */}
      <div style={{ padding: '24px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.5px', margin: 0 }}>
          Webtel HR
        </h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Search size={22} style={{ color: 'var(--text-main)', cursor: 'pointer' }} strokeWidth={2} />
          <Bell size={22} style={{ color: 'var(--text-main)', cursor: 'pointer' }} strokeWidth={2} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {modules.map((mod, idx) => (
          <SidebarItem key={idx} item={mod} depth={0} iaVersion={iaVersion} />
        ))}
      </div>

    </div>
  );
}