import React, { createContext, useContext, useState, useEffect } from 'react';

export const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [iaVersion, setIaVersion] = useState(1);
  const [navLayout, setNavLayout] = useState('topbar');
  const [dropdownStyle, setDropdownStyle] = useState('classic');

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === '1') {
        setIaVersion(1);
      } else if (e.key === '2') {
        setIaVersion(2);
      } else if (e.key.toLowerCase() === 'o') {
        setNavLayout(prev => prev === 'sidebar' ? 'topbar' : 'sidebar');
      } else if (e.key.toLowerCase() === 'p') {
        setDropdownStyle(prev => prev === 'classic' ? 'mega' : 'classic');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <MenuContext.Provider value={{ iaVersion, navLayout, dropdownStyle }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
