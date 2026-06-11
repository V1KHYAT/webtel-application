import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, LayoutGrid } from 'lucide-react';
import pagesData from '../data/pages-ia.json';

export default function GenericPage() {
  const { hubId } = useParams();
  const navigate = useNavigate();

  // Find the requested page from our 26 consolidated pages
  let currentPage = null;
  let currentModule = null;

  let currentCategory = null;

  for (const mod of pagesData.navigation) {
    if (!mod.categories) continue;
    for (const cat of mod.categories) {
      const found = cat.pages?.find(p => p.id === hubId);
      if (found) {
        currentPage = found;
        currentCategory = cat;
        currentModule = mod;
        break;
      }
    }
    if (currentPage) break;
  }

  if (!currentPage) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Page not found ({hubId})</h2>
        <button onClick={() => navigate('/')}>Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Breadcrumb / Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500, padding: 0
          }}
        >
          <ChevronLeft size={16} /> Dashboard
        </button>
        <span style={{ color: 'var(--border-light)' }}>/</span>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{currentModule.module}</span>
        <span style={{ color: 'var(--border-light)' }}>/</span>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{currentCategory.name}</span>
        <span style={{ color: 'var(--border-light)' }}>/</span>
        <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>{currentPage.name}</span>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          {currentPage.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '700px', lineHeight: 1.5 }}>
          This page is a consolidated hub under the <b>{currentModule.module}</b> module. In the redesigned architecture, 
          this single unified page replaces the following <b>{currentPage.legacyFeatures.length}</b> separate screens from the legacy system.
        </p>
      </div>

      {/* Grid of merged features */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '16px' 
      }}>
        {currentPage.legacyFeatures.map((feat, idx) => (
          <div key={idx} style={{
            background: '#fff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            e.currentTarget.style.borderColor = 'var(--primary-subtle)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}>
            <div style={{ 
              background: 'var(--primary-subtle)', 
              color: 'var(--primary-color)',
              padding: '8px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LayoutGrid size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px', lineHeight: 1.3 }}>
                {feat}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Legacy Feature mapped to {currentPage.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
