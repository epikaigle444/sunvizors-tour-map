import React, { useState, useEffect } from 'react';
import MapComponent from './components/Map';
import VoteModal from './components/VoteModal';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import axios from 'axios';

// Configuration de l'URL de l'API :
// En ligne, on utilisera la variable d'environnement ou l'URL de production
// En local, on utilise le proxy configuré dans vite.config.js
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
    
    // Simple secret listener for Admin (press Ctrl+Shift+A)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdmin(prev => !prev);
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Leaderboard stats={stats} />
      
      <div className="absolute top-4 right-4 z-[1000] flex items-center space-x-6">
         <button 
            onClick={() => setIsAdmin(true)}
            className="px-6 py-3 text-sm bg-gold text-black hover:bg-white transition-all uppercase tracking-[0.2em] font-black rounded-full shadow-[0_0_20px_rgba(204,165,44,0.6)] border-2 border-white/20"
         >
            PANEL ADMIN
         </button>
         <a href="https://thesunvizors.com" target="_blank" rel="noreferrer" className="hidden md:block text-white/50 hover:text-gold text-xs uppercase tracking-widest font-bold">
            The Sunvizors
         </a>
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
  );
}

export default App;
