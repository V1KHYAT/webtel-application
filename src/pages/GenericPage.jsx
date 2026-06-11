import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, LayoutGrid, Search, Filter, SlidersHorizontal, FileText, CheckCircle, Settings, ChevronRight } from 'lucide-react';
import premiumIA from '../data/premium-ia.json';

export default function GenericPage() {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Find the requested page
  let currentPage = null;
  let currentModule = null;

  for (const mod of premiumIA.navigation) {
    if (!mod.categories) continue;
    for (const cat of mod.categories) {
      const found = cat.pages?.find(p => p.id === hubId);
      if (found) {
        currentPage = found;
        currentModule = mod;
        break;
      }
    }
    if (currentPage) break;
  }

  if (!currentPage) {
    return <div style={{ padding: '24px' }}>Page not found.</div>;
  }

  const legacyFeatures = currentPage.legacyContentSources || [];
  const isSettings = currentModule.module === 'Settings';
  const isReports = currentModule.module === 'Reports';
  const isApprovals = currentPage.name.includes('Approvals');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        padding: '24px 32px', 
        borderBottom: '1px solid var(--border-light)',
        background: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '13px' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <ChevronLeft size={14} />
          <span>{currentModule.module}</span>
          <ChevronLeft size={14} />
          <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{currentPage.name}</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {currentPage.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '800px', lineHeight: 1.5 }}>
          Wondering how we fit <b>{legacyFeatures.length}</b> dense legacy screens into this single page? 
          Below is a live demonstration of modern UX patterns doing exactly that.
        </p>
      </div>

      {/* Dynamic UX Pattern Demonstration */}
      <div style={{ flex: 1, padding: '32px', overflow: 'auto', background: 'var(--bg-light)' }}>
        
        {isSettings ? (
          /* PATTERN 1: VERTICAL TABS (For Settings & Configs) */
          <div style={{ display: 'flex', gap: '32px', height: '100%' }}>
            <div style={{ width: '280px', flexShrink: 0, background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)', fontWeight: 600 }}>
                Configuration Sections
              </div>
              <div style={{ padding: '8px' }}>
                {legacyFeatures.map((feat, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveTab(idx)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: activeTab === idx ? 500 : 400,
                      background: activeTab === idx ? 'var(--primary-light)' : 'transparent',
                      color: activeTab === idx ? 'var(--primary-dark)' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}
                  >
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{feat}</span>
                    {activeTab === idx && <ChevronRight size={16} />}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Settings size={24} color="var(--primary)" />
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>{legacyFeatures[activeTab] || 'Select a section'}</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Instead of navigating to a completely new webpage, the user simply clicks the vertical tab on the left.
                The dense form/settings related to <b>{legacyFeatures[activeTab]}</b> load instantly right here.
              </p>
            </div>
          </div>

        ) : isApprovals ? (
          /* PATTERN 2: UNIFIED INBOX (For Approvals) */
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Unified Inbox</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '14px' }}>
                  <Filter size={16} />
                  <span>Filter Type: All ({legacyFeatures.length})</span>
                </div>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--text-secondary)' }}>Request Type</th>
                  <th style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--text-secondary)' }}>Employee</th>
                  <th style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--text-secondary)' }}>Date</th>
                  <th style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--text-secondary)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {legacyFeatures.slice(0, 5).map((feat, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 500 }}>
                        {feat}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>John Doe</td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>Today</td>
                    <td style={{ padding: '16px 20px' }}>
                      <button style={{ background: 'var(--primary)', color: 'var(--primary-dark)', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
              We merge multiple approval screens into a single Unified Inbox. The legacy screens become filterable "Request Types".
            </div>
          </div>

        ) : (
          /* PATTERN 3: DATA LIBRARY / INDEX VIEW (For Reports & Data Hubs) */
          <>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder={`Search ${legacyFeatures.length} items...`}
                  style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '15px' }}
                />
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px', background: '#fff', border: '1px solid var(--border-light)', borderRadius: '8px', cursor: 'pointer' }}>
                <SlidersHorizontal size={18} /> Filters
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {legacyFeatures.map((feat, idx) => (
                <div key={idx} style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isReports ? <FileText size={24} /> : <LayoutGrid size={24} />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.3 }}>{feat}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        Clicking this card opens a slide-out drawer or full-screen view for this specific {isReports ? 'report' : 'feature'}, keeping the main navigation clean.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
