import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import v1IA from '../data/v1-ia.json';
import v2IA from '../data/v2-ia.json';
import v3IA from '../data/v3-ia.json';
import { LayoutGrid, FileText } from 'lucide-react';
import LegacyParser from '../components/layout/LegacyParser';

export default function GenericPage() {
  const { hubId } = useParams();
  const { iaVersion } = useMenu();

  // Find the page metadata across whichever JSON is currently active
  const currentIA = iaVersion === 3 ? v3IA : (iaVersion === 2 ? v2IA : v1IA);

  let currentPage = null;
  let currentModule = null;

  for (const mod of currentIA.navigation) {
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

  const legacyFeatures = currentPage.mergedFrom || currentPage.legacyContentSources || [];
  const isSettings = currentModule.module === 'Settings';
  const isReports = currentModule.module === 'Reports';
  const isApprovals = currentPage.name.includes('Approvals') || currentModule.module === 'Approvals';
  const isMerged = !!currentPage.mergedFrom;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header section removed as requested by the user, now handled in top navigation */}

      {/* Dynamic UX Pattern Demonstration */}
      <div style={{ flex: 1, padding: '32px', overflow: 'auto', background: 'var(--bg-light)' }}>
        
        {iaVersion === 1 || iaVersion === 3 ? (
          <LegacyParser page={currentPage} />
        ) : iaVersion === 2 && isMerged ? (
          /* MERGED PAGE INDICATOR FOR V2 REDESIGN */
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '32px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginTop: '32px' }}>
            <div style={{ display: 'inline-flex', background: '#fef08a', color: '#854d0e', padding: '6px 16px', borderRadius: '100px', fontWeight: 700, fontSize: '13px', marginBottom: '24px', letterSpacing: '0.5px' }}>
              MERGED COMPONENT
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>{currentPage.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
              This new section consolidates the functionality of multiple legacy V1 pages into a single modern interface. <br/><br/>
              <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>Please provide screenshots/images of the following original pages so we can begin the redesign:</span>
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', textAlign: 'left' }}>
              {currentPage.mergedFrom.map((feat, idx) => (
                <div key={idx} style={{ background: 'var(--bg-light)', border: '1px solid var(--border-light)', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <FileText size={20} color="var(--primary-color)" />
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '15px' }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        ) : iaVersion === 2 && !isMerged ? (
          /* BLANK CANVAS FOR V2 NON-MERGED PAGES */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            <LayoutGrid size={48} color="var(--border-light)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>{currentPage.name}</h3>
            <p style={{ maxWidth: '400px', textAlign: 'center', lineHeight: 1.5 }}>
              This page will be redesigned individually. Please provide the legacy screenshot or requirements to begin building out this interface.
            </p>
          </div>
        ) : (
          /* FALLBACK FOR V2/V3 IF NEEDED */
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            UI Version {iaVersion} Placeholder
          </div>
        )}
      </div>
    </div>
  );
}
