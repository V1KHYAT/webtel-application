import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Database, Image as ImageIcon, IndianRupee, FileText } from 'lucide-react';

// Helper to sanitize filename (same as crawler)
const sanitizeFilename = (name) => {
    return name.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
};

const LegacyParser = ({ page }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    if (!page) return;

    const fetchLegacyHtml = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filename = sanitizeFilename(page.name) + '.html';
        const response = await fetch(`/legacy-screens/${filename}`);
        
        if (!response.ok) {
          throw new Error('Legacy page not yet captured or missing.');
        }

        const htmlString = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // 1. Extract Form Fields
        const fields = [];
        const captions = doc.querySelectorAll('.TDCaption');
        
        captions.forEach(caption => {
          const labelText = caption.textContent.trim();
          if (!labelText) return;

          // Find the input element in the next sibling cells
          let nextNode = caption.nextElementSibling;
          let inputEl = null;
          
          while (nextNode) {
            inputEl = nextNode.querySelector('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
            if (inputEl) break;
            nextNode = nextNode.nextElementSibling;
          }

          if (inputEl) {
            const type = inputEl.tagName.toLowerCase() === 'select' ? 'select' : (inputEl.type || 'text');
            const options = [];
            
            if (type === 'select') {
              inputEl.querySelectorAll('option').forEach(opt => {
                options.push({ value: opt.value, label: opt.textContent.trim() });
              });
            }

            fields.push({
              id: inputEl.id || inputEl.name || Math.random().toString(),
              label: labelText,
              type,
              value: inputEl.value || '',
              options
            });
          }
        });

        // 2. Extract Action Buttons
        const btns = [];
        doc.querySelectorAll('input[type="submit"], input[type="button"], button').forEach(btn => {
          const text = btn.value || btn.textContent.trim();
          if (text && text.toLowerCase() !== 'search') { // skip generic hidden search if any
             btns.push({
               id: btn.id || text,
               text,
               isPrimary: text.toLowerCase().includes('save') || text.toLowerCase().includes('submit') || text.toLowerCase().includes('update')
             });
          }
        });

        // 3. Extract GridViews (Tables)
        const extractedTables = [];
        doc.querySelectorAll('table').forEach(table => {
            const rules = table.getAttribute('rules');
            const className = table.className || '';
            const id = table.id || '';

            // Strict heuristic for ASP.NET DataGrids / GridViews
            const isDataGrid = 
                rules === 'all' || 
                className.toLowerCase().includes('grid') || 
                id.toLowerCase().includes('grid') || 
                id.toLowerCase().startsWith('dg') ||
                table.querySelector('.DataGridHeaderStyle, .GridHeader, th.hideGridColumn');

            if (!isDataGrid) return; // Skip layout tables entirely

            const rows = Array.from(table.rows);
            if (rows.length < 2) return;

            // Find the header row
            const headerRow = table.querySelector('.DataGridHeaderStyle, .GridHeader') || rows[0];
            const headers = Array.from(headerRow.cells).map(cell => cell.textContent.trim()).filter(h => h);
            
            const dataRows = [];
            rows.forEach(r => {
               if (r === headerRow) return;
               const cells = Array.from(r.cells).map(cell => cell.textContent.trim());
               if (cells.some(c => c)) dataRows.push(cells);
            });

            if (headers.length > 0 && dataRows.length > 0) {
               extractedTables.push({ headers, rows: dataRows });
            }
        });

        setFormData(fields);
        setButtons(btns);
        setTables(extractedTables);
        
      } catch (err) {
        console.error('Error parsing legacy HTML:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLegacyHtml();
  }, [page]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h5 style={{ color: '#ef4444', marginBottom: '12px' }}>Failed to Load Legacy Content</h5>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Note: If this page has tabs or sub-pages, they might be nested. 
            The crawler requires all pages to be downloaded.
          </p>
        </div>
      </div>
    );
  }

  // De-duplicate fields by ID just in case
  const uniqueFields = formData.reduce((acc, current) => {
    const x = acc.find(item => item.label === current.label);
    if (!x) return acc.concat([current]); else return acc;
  }, []);

  // Semantic Heuristic Engine (V2 Layout)
  const groupedFields = {
    Location: { icon: <MapPin size={24} color="var(--primary)" />, fields: [] },
    Contact: { icon: <Phone size={24} color="var(--primary)" />, fields: [] },
    Database: { icon: <Database size={24} color="var(--primary)" />, fields: [] },
    Media: { icon: <ImageIcon size={24} color="var(--primary)" />, fields: [] },
    Financial: { icon: <IndianRupee size={24} color="var(--primary)" />, fields: [] },
    General: { icon: <FileText size={24} color="var(--primary)" />, fields: [] }
  };

  uniqueFields.forEach(field => {
    const label = field.label.toLowerCase();
    if (field.type === 'file' || label.includes('image') || label.includes('logo') || label.includes('banner')) {
        groupedFields.Media.fields.push(field);
    } else if (label.includes('address') || label.includes('city') || label.includes('state') || label.includes('country') || label.includes('zip') || label.includes('pin') || label.includes('location')) {
        groupedFields.Location.fields.push(field);
    } else if (label.includes('phone') || label.includes('email') || label.includes('fax') || label.includes('website') || label.includes('mobile') || label.includes('extn')) {
        groupedFields.Contact.fields.push(field);
    } else if (label.includes('database') || label.includes('server') || label.includes('space') || label.includes('host') || label.includes('password')) {
        groupedFields.Database.fields.push(field);
    } else if (label.includes('bank') || label.includes('account') || label.includes('branch') || label.includes('ifsc') || label.includes('tax') || label.includes('pan')) {
        groupedFields.Financial.fields.push(field);
    } else {
        groupedFields.General.fields.push(field);
    }
  });

  const activeGroups = Object.entries(groupedFields).filter(([_, group]) => group.fields.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {activeGroups.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {activeGroups.map(([groupName, group]) => (
            <div key={groupName} style={{ 
              background: 'rgba(255, 255, 255, 0.7)', 
              backdropFilter: 'blur(16px)',
              borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.4)', 
              padding: '32px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{group.icon}</div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{groupName} Details</h3>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
                gap: '24px' 
              }}>
                {group.fields.map((field, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                    <label style={{ 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginLeft: '4px'
                    }}>
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <div style={{ position: 'relative' }}>
                        <select 
                          defaultValue={field.value}
                          style={{ 
                            width: '100%',
                            padding: '14px 16px', 
                            borderRadius: '12px', 
                            border: '1px solid rgba(0,0,0,0.08)', 
                            background: '#ffffff', 
                            color: 'var(--text-primary)', 
                            fontSize: '15px',
                            transition: 'all 0.2s ease',
                            appearance: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.08)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.01)'; }}
                        >
                          {field.options.map((opt, i) => (
                            <option key={i} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>
                          ▼
                        </div>
                      </div>
                    ) : field.type === 'radio' || field.type === 'checkbox' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px', background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)' }}>
                        <input type={field.type} defaultChecked={field.value === 'on' || field.value === 'true'} />
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Select option</span>
                      </div>
                    ) : (
                      <input 
                        type={field.type} 
                        defaultValue={field.value} 
                        placeholder={field.type === 'file' ? '' : `Enter ${field.label.toLowerCase()}`}
                        style={{ 
                          width: '100%',
                          padding: '14px 16px', 
                          borderRadius: '12px', 
                          border: '1px solid rgba(0,0,0,0.08)', 
                          background: '#ffffff', 
                          color: 'var(--text-primary)', 
                          fontSize: '15px',
                          transition: 'all 0.2s ease',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.01)'
                        }}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.08)'; e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.01)'; }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {buttons.length > 0 && (
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          padding: '24px 32px', 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.06)',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          {buttons.map((btn, idx) => (
            <button 
              key={idx} 
              style={{
                padding: '12px 32px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: btn.isPrimary ? 'none' : '1px solid rgba(0,0,0,0.1)',
                background: btn.isPrimary ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : '#ffffff',
                color: btn.isPrimary ? '#ffffff' : 'var(--text-primary)',
                boxShadow: btn.isPrimary ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                if (btn.isPrimary) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.3)';
                } else {
                  e.target.style.background = 'var(--bg-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (btn.isPrimary) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
                } else {
                  e.target.style.background = '#ffffff';
                }
              }}
            >
              {btn.text}
            </button>
          ))}
        </div>
      )}

      {tables.length > 0 && tables.map((table, idx) => (
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '16px', 
          border: '1px solid rgba(0,0,0,0.06)', 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }} key={idx}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
            <h5 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600 }}>Data Overview</h5>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>Records parsed from legacy grid</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-light)' }}>
                  {table.headers.map((h, i) => (
                    <th key={i} style={{ 
                      padding: '16px 32px', 
                      textAlign: 'left', 
                      fontWeight: 600, 
                      color: 'var(--text-secondary)', 
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '12px'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ 
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                    transition: 'background 0.2s',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {row.map((cell, cIdx) => <td key={cIdx} style={{ padding: '16px 32px', color: 'var(--text-primary)' }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {uniqueFields.length === 0 && tables.length === 0 && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(16px)',
          borderRadius: '16px', 
          border: '1px dashed rgba(0,0,0,0.1)', 
          padding: '60px 40px', 
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '24px'
          }}>
            📄
          </div>
          <h5 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '18px', fontWeight: 600 }}>No Interactive Elements Found</h5>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '400px', margin: '0 auto' }}>This could be a dashboard, an empty parent node, or a view-only page without recognizable forms.</p>
        </div>
      )}
    </div>
  );
};

export default LegacyParser;
