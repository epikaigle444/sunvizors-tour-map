import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cities } from '../data/cities';

const ShareModal = ({ onClose, city, leaderboard }) => {
  const siteUrl = window.location.origin;
  const [selectedInviteCity, setSelectedInviteCity] = useState(city || (leaderboard && leaderboard.length > 0 ? leaderboard[0].city : "Paris"));

  // 1. Classement (Texte formaté)
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

  // --- SHARE HANDLERS ---
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
          
          {/* 1. CLASSEMENT */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-3 flex items-center gap-2">
              🏆 Partager le classement
            </h3>
            <div className="flex justify-between gap-3">
               <ShareBtn type="facebook" onClick={() => shareTo('facebook', getLeaderboardText(), siteUrl)} />
               <ShareBtn type="twitter" onClick={() => shareTo('twitter', getLeaderboardText(), siteUrl)} />
               <ShareBtn type="whatsapp" onClick={() => shareTo('whatsapp', getLeaderboardText(), siteUrl)} />
               <ShareBtn type="copy" onClick={() => shareTo('copy', getLeaderboardText(), siteUrl)} />
            </div>
          </div>

          {/* 2. INVITER AMIS */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-3 flex items-center gap-2">
              💌 Mobiliser vos amis
            </h3>
            
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

          {/* 3. CARTE */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-3">🗺️ Partager la carte</h3>
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
  const icons = {
    facebook: <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />,
    twitter: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
    whatsapp: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.328-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.41 0 .01 5.399.007 12.039c0 2.123.554 4.197 1.608 6.041L0 22.5l4.583-1.201a11.783 11.783 0 005.46 1.34h.004c6.638 0 12.039-5.4 12.042-12.04.002-3.218-1.248-6.242-3.517-8.511z" />,
    copy: <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.4 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
  };

  const colors = {
    facebook: 'bg-blue-600',
    twitter: 'bg-black border border-white/20',
    whatsapp: 'bg-green-600',
    copy: 'bg-neutral-700'
  };

  return (
    <button 
      onClick={onClick}
      className={`${colors[type]} hover:opacity-80 text-white flex-1 py-3 rounded-lg font-bold text-xs flex items-center justify-center transition-all shadow-lg active:scale-95`}
    >
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {type === 'copy' ? (
          <g fill="none" stroke="currentColor" strokeWidth="2">
            {icons[type]}
          </g>
        ) : icons[type]}
      </svg>
    </button>
  );
};

export default ShareModal;
