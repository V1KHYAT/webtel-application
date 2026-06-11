import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children }) {
  return (
    <div className="app-wrapper" style={{ flexDirection: 'row' }}>
      <Sidebar />
      <div className="content-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <main id="app-content">
          <Header />
          {children}
        </main>
      </div>
    </div>
  );
}
