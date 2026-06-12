import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Header from './Header';
import { useMenu } from '../../context/MenuContext';

export default function AppLayout({ children }) {
  const { navLayout } = useMenu();

  return (
    <div className="app-wrapper" style={{ flexDirection: navLayout === 'topbar' ? 'column' : 'row' }}>
      {navLayout === 'sidebar' && <Sidebar />}
      {navLayout === 'topbar' && <TopNavbar />}
      <div className="content-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: navLayout === 'topbar' ? 'calc(100vh - 42px)' : '100vh', overflowY: 'auto' }}>
        <main id="app-content">
          <Header />
          {children}
        </main>
      </div>
    </div>
  );
}
