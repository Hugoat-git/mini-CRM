import { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import EmailList from './EmailList';

export default function MainLayout() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'emails'>('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleContactAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setCurrentView('dashboard');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'dashboard' ? (
          <Dashboard key={refreshTrigger} />
        ) : (
          <EmailList onContactAdded={handleContactAdded} />
        )}
      </div>
    </div>
  );
}
