import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Header from './Header';
import TopStatusBar from './TopStatusBar';
import QuickSearchModal from '../ui/QuickSearchModal';
import { useMenu } from '../../context/MenuContext';

export default function AppLayout({ children }) {
  const { navLayout } = useMenu();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <QuickSearchModal />
      <TopStatusBar />
      <div className="app-wrapper" style={{ flex: 1, flexDirection: navLayout === 'topbar' ? 'column' : 'row', display: 'flex', overflow: 'hidden' }}>
        {navLayout === 'sidebar' && <Sidebar />}
        {navLayout === 'topbar' && <TopNavbar />}
        <div className="content-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <main id="app-content">
            <Header />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
