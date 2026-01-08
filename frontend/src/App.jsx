import React, { useState, useEffect } from 'react';
import MapComponent from './components/Map';
import VoteModal from './components/VoteModal';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import ShareModal from './components/ShareModal';
import axios from 'axios';

// Configuration de l'URL de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [stats, setStats] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

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
    <div className="relative w-full h-screen bg-black overflow-hidden" id="map-container">
      <WelcomeScreen onStart={() => {}} />

      <div id="leaderboard-container">
        <Leaderboard stats={stats} />
      </div>
      
      <div className="absolute top-4 right-4 z-[1000] flex items-center space-x-4">
           <button 
              onClick={() => setIsShareOpen(true)}
              className="px-4 py-2 text-xs bg-white text-black hover:bg-gray-200 transition-all uppercase tracking-widest font-bold rounded shadow-lg border border-gray-300"
           >
              Partager
           </button>
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
          onOpenShare={() => setIsShareOpen(true)} // Pass this to modal
        />
      )}

      {isShareOpen && (
        <ShareModal 
          onClose={() => setIsShareOpen(false)} 
          city={selectedCity} 
          leaderboard={stats} 
        />
      )}
    </div>
  );
}

export default App;
