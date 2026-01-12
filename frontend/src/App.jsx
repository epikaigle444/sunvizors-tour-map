import React, { useState, useEffect } from 'react';
import MapComponent from './components/Map';
import VoteModal from './components/VoteModal';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import ShareModal from './components/ShareModal';
import InfoModal from './components/InfoModal';
import FullLeaderboardModal from './components/FullLeaderboardModal';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import axios from 'axios';

// Configuration de l'URL de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [stats, setStats] = useState([]);
  
  // États d'administration
  const [isAdminRoute, setIsAdminRoute] = useState(false); // Est-on sur l'URL /admin ?
  const [isAuthenticated, setIsAuthenticated] = useState(false); // A-t-on le mot de passe ?

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const fetchStats = async () => {
    try {
      // Détection auto : si on n'est pas sur Vercel ni localhost, on est sur LWS
      const isPHP = !window.location.hostname.includes('vercel.app') && !window.location.hostname.includes('localhost');
      const endpoint = isPHP ? '/api/stats.php' : '/api/stats';
      
      const res = await axios.get(`${endpoint}?t=${new Date().getTime()}`);
      setStats(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch stats", err);
      setStats([]);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    
    // Vérification de l'URL pour le mode Admin
    if (window.location.pathname === '/admin') {
      setIsAdminRoute(true);
    }

    return () => clearInterval(interval);
  }, []);

  // Si on est sur /admin
  if (isAdminRoute) {
    if (isAuthenticated) {
      return <AdminDashboard onClose={() => window.location.href = '/'} stats={stats} />;
    } else {
      return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
    }
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden" id="map-container">
      <WelcomeScreen onStart={() => {}} />

      {/* --- FLOATING LEFT PANEL (Leaderboard + Info) --- */}
      <div className="absolute top-4 left-4 z-[900] flex flex-col gap-4 max-w-[240px] md:max-w-[280px] pointer-events-none font-['Montserrat']">
        
        {/* LEADERBOARD (Top) */}
        <div id="leaderboard-container" className="pointer-events-auto">
          <Leaderboard 
            stats={stats} 
            onShare={() => setIsShareOpen(true)} 
            onOpenFull={() => setIsLeaderboardOpen(true)}
          />
        </div>

        {/* INFO BOXES (Below - Hidden on Mobile) */}
        <div className="hidden md:flex flex-col gap-4 pointer-events-auto">
           <div className="bg-black/80 backdrop-blur border border-gray-800 p-4 rounded text-white shadow-lg">
              <h3 className="text-gold text-xs font-bold uppercase mb-2 tracking-[0.2em] border-b border-gray-700 pb-1">Le concept</h3>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light">
                <strong className="text-white font-medium">The Sunvizors</strong> préparent leur tournée 2026. Votez pour faire venir le groupe dans votre ville ! Chaque voix compte pour dessiner notre route.
              </p>
           </div>
           
           <div className="bg-black/80 backdrop-blur border border-gray-800 p-4 rounded text-white shadow-lg">
              <h3 className="text-gold text-xs font-bold uppercase mb-2 tracking-[0.2em] border-b border-gray-700 pb-1">Participation</h3>
              <ul className="text-xs md:text-sm text-gray-300 space-y-2 list-none">
                <li className="flex gap-2"><span>1.</span> Cliquez sur un point</li>
                <li className="flex gap-2"><span>2.</span> Votez via votre email</li>
                <li className="flex gap-2"><span>3.</span> Partagez pour gagner !</li>
              </ul>
           </div>
        </div>

      </div>

      {/* BOUTONS ACTIONS (Bas Gauche) */}
      <div className="absolute bottom-24 left-4 md:bottom-8 md:left-8 z-[1000] flex flex-col gap-3">
           {/* Bouton Info (Mobile Only) */}
           <button 
              onClick={() => setIsInfoOpen(true)}
              className="md:hidden w-12 h-12 bg-black/80 border border-gold/50 text-gold rounded-full flex items-center justify-center shadow-lg pointer-events-auto"
           >
              <span className="font-serif italic font-bold text-xl">i</span>
           </button>

           {/* Bouton Partager */}
           <button 
              onClick={() => setIsShareOpen(true)}
              className="w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-3 bg-white text-black hover:bg-gold hover:text-black transition-all font-bold rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 group pointer-events-auto"
           >
              {/* Icone Partage */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              <span className="hidden md:inline text-xs uppercase tracking-widest">Partager</span>
           </button>
      </div>

      {/* LOGO (Centered Top - Hidden on Mobile to avoid overlap) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] hidden md:block">
         <img 
           src="https://thesunvizors.com/wp-content/uploads/2024/12/OR-THE-SUNVIZORS-2018-seul-sansFOND.png" 
           alt="The Sunvizors" 
           className="w-32 md:w-48 drop-shadow-md opacity-90 hover:opacity-100 transition-opacity"
         />
      </div>

      {/* LOGO MOBILE (Haut Droite - Remplace le bouton Admin) */}
      <div className="absolute top-4 right-4 z-[1000] md:hidden">
         <img 
           src="https://thesunvizors.com/wp-content/uploads/2024/12/OR-THE-SUNVIZORS-2018-seul-sansFOND.png" 
           alt="The Sunvizors" 
           className="w-20 drop-shadow-md"
         />
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

      {isInfoOpen && (
        <InfoModal onClose={() => setIsInfoOpen(false)} />
      )}

      {isLeaderboardOpen && (
        <FullLeaderboardModal onClose={() => setIsLeaderboardOpen(false)} stats={stats} />
      )}
    </div>
  );
}

export default App;
