import { useState, useEffect } from 'react';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import { checkImapConfig } from './services/api';

function App() {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConfig();
  }, []);

  const checkConfig = async () => {
    try {
      const data = await checkImapConfig();
      setIsConfigured(data.configured);
    } catch (error) {
      console.error('Error checking config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsConfigured(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <>
      {!isConfigured ? (
        <Login onSuccess={handleLoginSuccess} />
      ) : (
        <MainLayout />
      )}
    </>
  );
}

export default App;
