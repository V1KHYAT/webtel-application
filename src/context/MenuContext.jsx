import React, { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [iaVersion, setIaVersion] = useState(2);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '1') setIaVersion(1);
      if (e.key === '2') setIaVersion(2);
      if (e.key === '3') setIaVersion(3);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <MenuContext.Provider value={{ iaVersion, setIaVersion }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
