import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import GenericPage from './pages/GenericPage';
import { MenuProvider } from './context/MenuContext';

function App() {
  return (
    <MenuProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/page/:hubId" element={<GenericPage />} />
        </Routes>
      </AppLayout>
    </MenuProvider>
  );
}

export default App;
