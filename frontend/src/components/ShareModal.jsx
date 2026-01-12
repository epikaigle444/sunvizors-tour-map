import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cities } from '../data/cities';

const ShareModal = ({ onClose, city, leaderboard }) => {
  const siteUrl = window.location.origin;
  const [selectedInviteCity, setSelectedInviteCity] = useState(city || (leaderboard && leaderboard.length > 0 ? leaderboard[0].city : "Paris"));

  const getLeaderboardText = () => {
    if (!Array.isArray(leaderboard) || leaderboard.length === 0) return "Découvrez où les fans veulent voir The Sunvizors en concert !";
    const top5 = leaderboard.slice(0, 5).map((item, i) => `${i+1}. ${item.city}`).join(' | ');
    return `🔥 Le Top 5 actuel pour la tournée The Sunvizors : ${top5}... Votre ville est-elle dans la liste ? Venez voter ici :`;
  };

  const getInviteText = () => {
    return `Aidez-moi à faire venir The Sunvizors à ${selectedInviteCity} ! Chaque vote compte pour que le groupe s'arrête chez nous ! 🎤`;
  };
  
  const getInviteUrl = () => {
    return `${siteUrl}?city=${encodeURIComponent(selectedInviteCity)}`;
  };

  const getMapText = () => "Explorez la carte interactive de la tournée 2026 de The Sunvizors et votez pour votre ville ! 🗺️";

  const shareTo = (platform, text, url) => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank');
    } else if (platform === 'copy') {
      const fullText = `${text} ${url}`;
      navigator.clipboard.writeText(fullText);
      alert('Message et lien copiés !');
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
        className="bg-neutral-900 border border-gold text-white p-6 rounded-xl shadow-2xl max-w-md w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
        <h2 className="text-xl font-bold text-gold mb-6 text-center uppercase tracking-widest">Propulser la tournée</h2>

        <div className="space-y-6">
          
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-3 flex items-center gap-2">🏆 Partager le classement</h3>
            <div className="flex justify-between gap-3">
               <ShareBtn type="facebook" onClick={() => shareTo('facebook', getLeaderboardText(), siteUrl)} />
               <ShareBtn type="twitter" onClick={() => shareTo('twitter', getLeaderboardText(), siteUrl)} />
               <ShareBtn type="whatsapp" onClick={() => shareTo('whatsapp', getLeaderboardText(), siteUrl)} />
               <ShareBtn type="copy" onClick={() => shareTo('copy', getLeaderboardText(), siteUrl)} />
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-3 flex items-center gap-2">💌 Mobiliser vos amis</h3>
            <div className="mb-4">
              <label className="text-[10px] text-gold font-bold uppercase tracking-widest block mb-2">Ville à soutenir :</label>
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
            <div className="flex justify-between gap-3">
               <ShareBtn type="facebook" onClick={() => shareTo('facebook', getInviteText(), getInviteUrl())} />
               <ShareBtn type="twitter" onClick={() => shareTo('twitter', getInviteText(), getInviteUrl())} />
               <ShareBtn type="whatsapp" onClick={() => shareTo('whatsapp', getInviteText(), getInviteUrl())} />
               <ShareBtn type="copy" onClick={() => shareTo('copy', getInviteText(), getInviteUrl())} />
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-3 text-center">🗺️ Partager la carte interactive</h3>
            <div className="flex justify-between gap-3">
               <ShareBtn type="facebook" onClick={() => shareTo('facebook', getMapText(), siteUrl)} />
               <ShareBtn type="twitter" onClick={() => shareTo('twitter', getMapText(), siteUrl)} />
               <ShareBtn type="whatsapp" onClick={() => shareTo('whatsapp', getMapText(), siteUrl)} />
               <ShareBtn type="copy" onClick={() => shareTo('copy', getMapText(), siteUrl)} />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

const ShareBtn = ({ type, onClick }) => {
  // URLs des icônes officielles via SimpleIcons
  const iconUrls = {
    facebook: "https://cdn.simpleicons.org/facebook/white",
    twitter: "https://cdn.simpleicons.org/x/white",
    whatsapp: "https://cdn.simpleicons.org/whatsapp/white"
  };

  const colors = {
    facebook: 'bg-[#1877F2]',
    twitter: 'bg-black border border-white/20',
    whatsapp: 'bg-[#25D366]',
    copy: 'bg-neutral-700'
  };

  return (
    <button 
      onClick={onClick}
      className={`${colors[type]} hover:opacity-90 text-white flex-1 py-3 rounded-lg flex items-center justify-center transition-all shadow-lg active:scale-95`}
    >
      {type === 'copy' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      ) : (
        <img 
          src={iconUrls[type]} 
          className="w-5 h-5 object-contain" 
          alt={type}
          // Sécurité anti-coupure : petite marge interne via padding
          style={{ padding: '1px' }}
        />
      )}
    </button>
  );
};

export default ShareModal;
