import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { useMenu } from '../../context/MenuContext';
import { useNavigate } from 'react-router-dom';
import dropdownDataV1 from '../../../dropdown.json';
import premiumIA from '../../data/premium-ia.json';
import v3IA from '../../data/v3-ia.json';
import v4IA from '../../data/v4-ia.json';

// V1 flattener
function flattenIA_V1(navigationData) {
  const items = [];
  navigationData.forEach(mod => {
    if (!mod.categories) return;
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

const formattedV1Data = flattenIA_V1(dropdownDataV1.navigation);

// Format V2 Data
const formattedV2Data = [];
premiumIA.navigation.forEach(mod => {
  if (!mod.categories) return;
  mod.categories.forEach(cat => {
    if (!cat.pages) return;
    cat.pages.forEach(page => {
      formattedV2Data.push({
        id: page.id,
        name: page.name,
        type: 'V2 Page',
        module: mod.module,
        category: cat.name,
        legacySources: page.legacyContentSources || [],
        route: `/page/${page.id}`
      });
      (page.legacyContentSources || []).forEach(legacy => {
        formattedV2Data.push({
          id: page.id,
          name: legacy,
          type: 'Legacy Feature inside V2',
          module: mod.module,
          category: page.name,
          legacySources: [],
          route: `/page/${page.id}`
        });
      });
    });
  });
});

// Format V3 Data
const formattedV3Data = [];
v3IA.navigation.forEach(mod => {
  if (!mod.categories) return;
  mod.categories.forEach(cat => {
    if (!cat.pages) return;
    cat.pages.forEach(page => {
      formattedV3Data.push({
        id: page.id,
        name: page.name,
        type: 'V3 Page',
        module: mod.module,
        category: cat.name,
        legacySources: page.legacyContentSources || [],
        route: `/page/${page.id}`
      });
    });
  });
});

// Format V4 Data
const formattedV4Data = [];
v4IA.navigation.forEach(mod => {
  if (!mod.categories) return;
  mod.categories.forEach(cat => {
    if (!cat.pages) return;
    cat.pages.forEach(page => {
      formattedV4Data.push({
        id: page.id,
        name: page.name,
        type: 'V4 Page',
        module: mod.module,
        category: cat.name,
        legacySources: page.legacyContentSources || [],
        route: `/page/${page.id}`
      });
      (page.legacyContentSources || []).forEach(legacy => {
        formattedV4Data.push({
          id: page.id,
          name: legacy,
          type: 'Legacy Feature inside V4',
          module: mod.module,
          category: page.name,
          legacySources: [],
          route: `/page/${page.id}`
        });
      });
    });
  });
});

const fuseOptions = {
  keys: ['name', 'module', 'category', 'type', 'legacySources'],
  threshold: 0.3,
  includeMatches: true
};

const fuseV1 = new Fuse(formattedV1Data, fuseOptions);
const fuseV2 = new Fuse(formattedV2Data, fuseOptions);
const fuseV3 = new Fuse(formattedV3Data, fuseOptions);
const fuseV4 = new Fuse(formattedV4Data, fuseOptions);

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const { iaVersion } = useMenu();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fuse = iaVersion === 4 ? fuseV4 : (iaVersion === 3 ? fuseV3 : (iaVersion === 2 ? fuseV2 : fuseV1));
    const searchResults = fuse.search(query);
    setResults(searchResults.slice(0, 8).map(res => res.item));
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
                <a key={i} href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsFocused(false);
                    setQuery('');
                    if (res.route) navigate(res.route);
                  }}
                  style={{ 
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
