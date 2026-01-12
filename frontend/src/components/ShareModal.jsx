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
  const icons = {
    facebook: <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />,
    twitter: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
    whatsapp: <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.023.814 3.146.815 3.182 0 5.768-2.587 5.769-5.767 0-3.18-2.587-5.766-5.769-5.766zm3.426 8.313c-.124.355-.613.662-.848.75-.236.088-.546.125-1.332-.188-1.02-.405-1.829-1.355-2.14-1.781-.3-.427-1.475-1.987-1.475-3.507 0-1.52.806-2.247 1.107-2.547.3-.3.545-.355.729-.355.184 0 .366.003.522.012.188.012.39-.011.59.417.2.429.696 1.762.762 1.887.067.125.111.269.022.446-.089.177-.149.289-.298.462-.149.174-.314.388-.448.522-.133.133-.273.279-.122.531.151.252.662 1.144 1.392 1.791.944.833 1.742 1.091 1.995 1.217.253.126.402.105.553-.068.15-.173.645-.752.819-1.008.174-.256.346-.215.58-.127.234.088 1.488.701 1.747.83.259.129.431.194.493.31.062.115.062.669-.062 1.024z" />,
    copy: <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
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
      <svg 
        className="w-6 h-6 fill-current" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
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