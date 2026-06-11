import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, Users, Monitor, UserCog, Clock, 
  CheckSquare, FileWarning, BadgeDollarSign, 
  PieChart, Grip, Plane, Target, GraduationCap, 
  Briefcase, UserPlus, ChevronRight, ChevronDown, Home,
  FileUp, Settings as SettingsIcon, Database
} from 'lucide-react';
import dropdownDataV1 from '../../../dropdown.json';
import dropdownDataV2 from '../../data/dropdown-v2.json';
import { useMenu } from '../../context/MenuContext';

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
  "Onboarding": UserPlus
};

const iconMapV2 = {
  "People": Users,
  "Attendance & Leave": Clock,
  "Payroll": BadgeDollarSign,
  "Performance & Training": Target,
  "Travel & Expenses": Plane,
  "Assets": Monitor,
  "Approvals Hub": CheckSquare,
  "Import Center": FileUp,
  "Report Builder": PieChart,
  "Settings": SettingsIcon
};

const NestedMenuItem = ({ item, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasItems = item.items && item.items.length > 0;
  
  return (
    <div style={{ marginTop: '2px' }}>
      <a 
        href="#" 
        onClick={(e) => { 
          e.preventDefault(); 
          if (hasItems) setIsOpen(!isOpen); 
        }}
        style={{ 
          fontSize: depth === 0 ? '12px' : '11px', 
          fontWeight: 600, 
          padding: '6px 10px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: depth === 0 ? 'var(--text-main)' : 'var(--text-secondary)',
          background: isOpen ? 'var(--bg-hover)' : 'transparent',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        <span>{item.name}</span>
        {hasItems && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
      </a>
      {isOpen && hasItems && <NestedMenu items={item.items} depth={depth + 1} />}
    </div>
  );
};

const NestedMenu = ({ items, depth = 0 }) => {
  return (
    <div style={{ paddingLeft: depth === 0 ? '0' : '12px', marginTop: '4px', marginBottom: depth === 0 ? '8px' : '0' }}>
      {items.map((item, idx) => {
        if (typeof item === 'string') {
          return (
            <a 
              key={idx} 
              href="#" 
              style={{ 
                fontSize: '12px', 
                padding: '6px 10px', 
                display: 'block', 
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                marginBottom: '2px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-color)';
                e.currentTarget.style.background = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {item}
            </a>
          );
        } else if (typeof item === 'object' && item.name) {
          return <NestedMenuItem key={idx} item={item} depth={depth} />;
        }
        return null;
      })}
    </div>
  );
};

export default function Sidebar() {
  const [expandedModule, setExpandedModule] = useState(null);
  const { iaVersion } = useMenu();

  const modules = useMemo(() => {
    const rawData = iaVersion === 1 ? dropdownDataV1.navigation : dropdownDataV2.navigation;
    
    return rawData.map(mod => {
      if (!mod.categories) return mod;
      
      let newCategories = [];
      let generalActions = [];
      
      mod.categories.forEach(cat => {
        if (cat.name === "General Actions") {
          if (cat.items) {
            generalActions = cat.items;
          }
        } else {
          newCategories.push(cat);
        }
      });
      
      // Append general actions without nesting
      generalActions.forEach(action => {
        newCategories.push(action);
      });
      
      return { ...mod, categories: newCategories };
    });
  }, [iaVersion]);

  const currentIconMap = iaVersion === 1 ? iconMapV1 : iconMapV2;

  return (
    <div className="sidebar-column" style={{ position: 'relative' }}>
      
      {/* AB Test Badge */}
      <div style={{ position: 'absolute', top: '-30px', left: 0, fontSize: '11px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
        [ Press 1 or 2 to toggle IA: V{iaVersion} ]
      </div>

      <div className="notion-sidebar">
        <div className="notion-group" style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.2px', padding: '16px 16px 8px 16px', borderBottom: '1px solid var(--border-light)', marginBottom: '8px', textTransform: 'none' }}>
          Webtel HRMS {iaVersion === 2 && <span style={{ color: 'var(--primary-color)', fontSize: '11px', marginLeft: '4px' }}>(Redesign)</span>}
        </div>
        <nav className="notion-nav">
          
          <div style={{ marginBottom: '8px' }}>
            <a href="#" className={expandedModule === null ? 'active' : ''} onClick={(e) => { e.preventDefault(); setExpandedModule(null); }}>
              <Home size={18} />
              <span style={{ flex: 1 }}>Home</span>
            </a>
          </div>

          {modules.map((mod) => {
            const Icon = currentIconMap[mod.module] || Grip;
            const isExpanded = expandedModule === mod.module;
            return (
              <div key={mod.module}>
                <a 
                  href="#" 
                  className={isExpanded ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setExpandedModule(isExpanded ? null : mod.module);
                  }}
                >
                  <Icon size={18} />
                  <span style={{ flex: 1 }}>{mod.module}</span>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </a>
                
                {isExpanded && mod.categories && (
                  <div className="notion-submenu" style={{ paddingLeft: '8px' }}>
                    <NestedMenu items={mod.categories} depth={0} />
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
