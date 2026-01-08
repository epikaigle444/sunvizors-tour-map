import React, { useState, useEffect } from 'react';
import MapComponent from './components/Map';
import VoteModal from './components/VoteModal';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import axios from 'axios';

// Configuration de l'URL de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [stats, setStats] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdmin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (isAdmin) {
    return <AdminDashboard onClose={() => setIsAdmin(false)} stats={stats} />;
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex" id="root-app">
      
      {/* New Welcome & Sidebar Controller */}
      <WelcomeScreen />

      {/* Main Content Area */}
      <div className="relative flex-1 h-full">
        <Leaderboard stats={stats} />
        
        <div className="absolute top-4 right-4 z-[1000] flex items-center space-x-4 no-capture">
           <button 
              onClick={() => setIsAdmin(true)}
              className="px-3 py-1 text-[10px] bg-gold text-black hover:bg-yellow-500 transition-all uppercase tracking-widest font-bold rounded shadow-lg"
           >
              Admin
           </button>
        </div>

        <MapComponent onCitySelect={setSelectedCity} />

        {selectedCity && (
          <VoteModal 
            city={selectedCity} 
            onClose={() => setSelectedCity(null)} 
            onVoteSuccess={fetchStats}
          />
        )}
      </div>
    </div>
  );
}

export default App;
