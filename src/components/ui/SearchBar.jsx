import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { useMenu } from '../../context/MenuContext';
import { useNavigate } from 'react-router-dom';
import v1IA from '../../data/v1-ia.json';
import v2IA from '../../data/v2-ia.json';

// Recursive flattener
function flattenItems(items, moduleName, currentCategory = '', result = [], isV1 = true) {
  if (!items) return result;
  
  items.forEach(item => {
    if (item.type === 'page') {
      result.push({
        id: item.id,
        name: item.name,
        type: isV1 ? 'V1 Page' : 'V2 Page',
        module: moduleName,
        category: currentCategory,
        legacySources: item.legacyContentSources || [],
        route: `/page/${item.id}`
      });
      (item.legacyContentSources || []).forEach(legacy => {
        result.push({
          id: item.id,
          name: legacy,
          type: isV1 ? 'Legacy Feature inside V1' : 'Legacy Feature inside V2',
          module: moduleName,
          category: item.name,
          legacySources: [],
          route: `/page/${item.id}`
        });
      });
    } else if (item.type === 'category' || item.items) {
      flattenItems(item.items, moduleName, item.name, result, isV1);
    }
  });
  return result;
}

const formattedV1Data = [];
v1IA.navigation.forEach(mod => {
  flattenItems(mod.items, mod.module, '', formattedV1Data, true);
});

const formattedV2Data = [];
v2IA.navigation.forEach(mod => {
  flattenItems(mod.items, mod.module, '', formattedV2Data, false);
});

const fuseOptions = {
  keys: ['name', 'module', 'category', 'type', 'legacySources'],
  threshold: 0.3,
  includeMatches: true
};

const fuseV1 = new Fuse(formattedV1Data, fuseOptions);
const fuseV2 = new Fuse(formattedV2Data, fuseOptions);

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

    const fuse = iaVersion === 2 ? fuseV2 : fuseV1;
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
