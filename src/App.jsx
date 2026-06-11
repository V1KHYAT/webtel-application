import React from 'react';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import { MenuProvider } from './context/MenuContext';

function App() {
  return (
    <MenuProvider>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </MenuProvider>
  );
}

export default App;
