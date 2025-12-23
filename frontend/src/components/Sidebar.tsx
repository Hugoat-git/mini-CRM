import { Users, Mail } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'emails';
  onViewChange: (view: 'dashboard' | 'emails') => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">CRM Outlook</h1>
        <p className="text-sm text-gray-500 mt-1">Extracteur de contacts</p>
      </div>

      <nav className="flex-1 p-4">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition mb-2 ${
            currentView === 'dashboard'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users size={20} />
          <span className="font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => onViewChange('emails')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            currentView === 'emails'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Mail size={20} />
          <span className="font-medium">Emails</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}
