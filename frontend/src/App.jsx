import React, { useState, useEffect } from 'react';
import MapComponent from './components/Map';
import VoteModal from './components/VoteModal';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import ShareModal from './components/ShareModal';
import WelcomeScreen from './components/WelcomeScreen';
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

      {/* --- SIDEBAR EXPLICATIVE (Desktop Only) --- */}
      <div className="hidden md:flex absolute top-0 left-0 h-full w-[280px] z-[900] bg-neutral-900/90 backdrop-blur border-r border-gold/20 p-6 flex-col shadow-2xl pointer-events-auto">
        <div className="mt-20 space-y-6">
           <div className="p-4 bg-black/40 rounded border border-gray-800">
              <h3 className="text-gold text-sm font-bold uppercase mb-2 tracking-widest">Le concept</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-white">The Sunvizors</strong> préparent leur tournée 2026. 
                <br/><br/>
                Votez pour faire venir le groupe dans votre ville ! Les villes avec le plus de votes seront prioritaires.
              </p>
           </div>
           
           <div className="p-4 bg-black/40 rounded border border-gray-800">
              <h3 className="text-gold text-sm font-bold uppercase mb-2 tracking-widest">Comment participer ?</h3>
              <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                <li>Cliquez sur un point sur la carte</li>
                <li>Entrez votre email pour voter</li>
                <li>Partagez pour grimper au classement !</li>
              </ul>
           </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-gray-800">
            <p className="text-[10px] text-gray-600 text-center">© 2026 The Sunvizors</p>
        </div>
      </div>

      <div id="leaderboard-container">
        <Leaderboard stats={stats} />
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
         <img 
           src="https://thesunvizors.com/wp-content/uploads/2024/12/OR-THE-SUNVIZORS-2018-seul-sansFOND.png" 
           alt="The Sunvizors" 
           className="w-32 md:w-48 drop-shadow-md opacity-90 hover:opacity-100 transition-opacity"
         />
      </div>
      
      {/* BOUTON ADMIN (Haut Droite) */}
      <div className="absolute top-4 right-4 z-[1000]">
           <button 
              onClick={() => setIsAdmin(true)}
              className="px-3 py-1 text-[10px] bg-gold text-black hover:bg-yellow-500 transition-all uppercase tracking-widest font-bold rounded shadow-lg"
           >
              Admin
           </button>
      </div>

      {/* BOUTON PARTAGER (Bas Gauche) */}
      <div className="absolute bottom-8 left-8 z-[1000]">
           <button 
              onClick={() => setIsShareOpen(true)}
              className="w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-3 bg-white text-black hover:bg-gold hover:text-black transition-all font-bold rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 group"
           >
              {/* Icone Partage */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              <span className="hidden md:inline text-xs uppercase tracking-widest">Partager</span>
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
