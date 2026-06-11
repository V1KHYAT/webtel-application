import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { useMenu } from '../../context/MenuContext';
import dropdownDataV1 from '../../../dropdown.json';
import dropdownDataV2 from '../../data/dropdown-v2.json';

// Helper to flatten IA tree into searchable items
function flattenIA(navigationData) {
  const items = [];
  navigationData.forEach(mod => {
    if (!mod.categories) return;
    
    // For V2 Report Builder which has an array of strings directly under categories
    if (mod.categories.length > 0 && typeof mod.categories[0] === 'string') {
      mod.categories.forEach(item => {
        items.push({ name: item, module: mod.module, category: mod.module });
      });
      return;
    }

    mod.categories.forEach(cat => {
      if (typeof cat === 'string') {
        items.push({ name: cat, module: mod.module, category: mod.module });
      } else if (cat.items) {
        cat.items.forEach(item => {
          if (typeof item === 'string') {
            items.push({ name: item, module: mod.module, category: cat.name });
          } else if (item.name && item.items) {
            item.items.forEach(sub => {
              if (typeof sub === 'string') {
                items.push({ name: sub, module: mod.module, category: `${cat.name} > ${item.name}` });
              }
            });
          }
        });
      }
    });
  });
  return items;
}

const allItemsV1 = flattenIA(dropdownDataV1.navigation);
const allItemsV2 = flattenIA(dropdownDataV2.navigation);

// Configure fuse for fuzzy searching
const fuseOptions = {
  keys: ['name', 'category', 'module'],
  threshold: 0.4, // lower is more strict, 0.4 allows good typos
  ignoreLocation: true
};

const fuseV1 = new Fuse(allItemsV1, fuseOptions);
const fuseV2 = new Fuse(allItemsV2, fuseOptions);

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  
  const { iaVersion } = useMenu();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const fuse = iaVersion === 1 ? fuseV1 : fuseV2;
    // Fuse returns [{ item: { name, module, category }, refIndex }, ...]
    const fuseResults = fuse.search(query);
    return fuseResults.slice(0, 8).map(res => res.item);
  }, [query, iaVersion]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <Search size={22} style={{ position: 'absolute', left: '18px', top: '24px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={`Search features (Currently searching V${iaVersion} architecture)...`}
        style={{ 
          width: '100%', 
          padding: '12px 20px 12px 56px', 
          fontSize: '16px', 
          borderRadius: isFocused && query ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)', 
          border: 'none', 
          boxShadow: 'var(--shadow-lg)',
          outline: 'none',
          fontFamily: 'var(--font-family)',
          color: 'var(--text-main)',
          height: '48px',
          boxSizing: 'border-box'
        }} 
      />

      {isFocused && query && (
        <div style={{
          position: 'absolute',
          top: '48px',
          left: 0,
          right: 0,
          background: '#fff',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 100,
          border: '1px solid var(--border-light)',
          borderTop: 'none',
          overflow: 'hidden'
        }}>
          {results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-subtle)' }}>
                Suggestions for V{iaVersion}
              </div>
              {results.map((res, i) => (
                <a key={i} href="#" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 20px', 
                  borderBottom: '1px solid var(--border-light)',
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{res.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--primary-color)', fontWeight: 600, background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                        {res.module}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        • {res.category}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-placeholder)" />
                </a>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
