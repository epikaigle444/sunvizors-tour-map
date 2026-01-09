import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cities } from '../data/cities';

const ShareModal = ({ onClose, city, leaderboard }) => {
  const siteUrl = window.location.origin;
  const [selectedInviteCity, setSelectedInviteCity] = useState(city || (leaderboard && leaderboard.length > 0 ? leaderboard[0].city : "Paris"));

  // --- TEXT GENERATORS ---
  const getLeaderboardText = () => {
    if (!leaderboard || leaderboard.length === 0) return "Découvre le classement pour la tournée The Sunvizors !";
    const top3 = leaderboard.slice(0, 3).map((item, i) => `${i+1}. ${item.city}`).join(' | ');
    return `🔥 Le Top 3 pour la tournée The Sunvizors : ${top3}... Est-ce que ta ville y est ? Vote ici :`;
  };

  const getInviteText = () => {
    return `Viens m'aider à faire venir The Sunvizors à ${selectedInviteCity} ! On a besoin de ton vote !`;
  };
  
  const getInviteUrl = () => {
    return `${siteUrl}?city=${encodeURIComponent(selectedInviteCity)}`;
  };

  const getMapText = () => "Regarde la carte interactive de la tournée The Sunvizors et vote pour ta ville !";

  // --- SHARE HANDLERS ---
  const shareTo = (platform, text, url) => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Lien copié !');
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-neutral-900 border border-gold text-white p-6 rounded-xl shadow-2xl max-w-md w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
        <h2 className="text-xl font-bold text-gold mb-6 text-center uppercase tracking-widest">Partager l'aventure</h2>

        <div className="space-y-6">
          
          {/* 1. CLASSEMENT */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-2">🏆 Partager le classement</h3>
            <div className="flex justify-between gap-2">
               <ShareBtn icon="f" color="bg-blue-600" onClick={() => shareTo('facebook', getLeaderboardText(), siteUrl)} />
               <ShareBtn icon="X" color="bg-black border border-white/20" onClick={() => shareTo('twitter', getLeaderboardText(), siteUrl)} />
               <ShareBtn icon="🔗" color="bg-gray-600" onClick={() => shareTo('copy', getLeaderboardText(), siteUrl)} />
            </div>
          </div>

          {/* 2. INVITER AMIS */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-2">💌 Inviter des amis</h3>
            
            {/* City Selector */}
            <div className="mb-3">
              <label className="text-[10px] text-gray-500 uppercase tracking-wide block mb-1">Choisir la ville à soutenir :</label>
              <select 
                value={selectedInviteCity}
                onChange={(e) => setSelectedInviteCity(e.target.value)}
                className="w-full bg-black border border-gray-700 text-white text-sm p-2 rounded focus:border-gold outline-none"
              >
                {cities.sort((a,b) => a.name.localeCompare(b.name)).map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between gap-2">
               <ShareBtn icon="f" color="bg-blue-600" onClick={() => shareTo('facebook', getInviteText(), getInviteUrl())} />
               <ShareBtn icon="X" color="bg-black border border-white/20" onClick={() => shareTo('twitter', getInviteText(), getInviteUrl())} />
               <ShareBtn icon="🔗" color="bg-gray-600" onClick={() => shareTo('copy', getInviteText(), getInviteUrl())} />
            </div>
          </div>

          {/* 3. CARTE */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-2">🗺️ Partager la carte</h3>
            <div className="flex justify-between gap-2">
               <ShareBtn icon="f" color="bg-blue-600" onClick={() => shareTo('facebook', getMapText(), siteUrl)} />
               <ShareBtn icon="X" color="bg-black border border-white/20" onClick={() => shareTo('twitter', getMapText(), siteUrl)} />
               <ShareBtn icon="🔗" color="bg-gray-600" onClick={() => shareTo('copy', getMapText(), siteUrl)} />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

// Petit composant bouton réutilisable
const ShareBtn = ({ icon, color, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`${color} hover:opacity-80 text-white flex-1 py-2 rounded font-bold text-xs flex items-center justify-center transition-all`}
  >
    {label || <span className="text-lg">{icon}</span>}
  </button>
);

export default ShareModal;