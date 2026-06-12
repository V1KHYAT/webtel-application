const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '../src/components/layout/Sidebar.jsx');
let content = fs.readFileSync(sidebarPath, 'utf8');

// I need to completely fix the broken render logic inside Sidebar.jsx

const fix = `        <nav className="notion-nav">
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
                          navigate(\`/page/\${page.id}\`);
                        }}
                        style={{ 
                          width: '100%',
                          display: 'block',
                          padding: '8px 12px',
                          background: location.pathname === \`/page/\${page.id}\` ? 'var(--primary-light)' : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          marginBottom: '2px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: location.pathname === \`/page/\${page.id}\` ? 'var(--primary-color)' : 'var(--text-main)',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = location.pathname === \`/page/\${page.id}\` ? 'var(--primary-light)' : 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = location.pathname === \`/page/\${page.id}\` ? 'var(--primary-light)' : 'transparent'}
                      >
                        {page.name}
                      </button>
                    );
                  }
                  
                  // Button that expands to show content under it
                  const hasPages = cat.pages && cat.pages.length > 0;
                  const isActiveCategory = hasPages && cat.pages.some(p => location.pathname === \`/page/\${p.id}\`);
                  
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
}`;

content = content.replace(/<nav className="notion-nav">[\s\S]*$/, fix);
fs.writeFileSync(sidebarPath, content);
console.log('Fixed syntax error in Sidebar.jsx');
