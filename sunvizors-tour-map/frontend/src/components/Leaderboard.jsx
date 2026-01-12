import React from 'react';

const Leaderboard = ({ stats, onShare, onOpenFull }) => {
  const top5 = Array.isArray(stats) ? stats.slice(0, 5) : [];

  // Calcul des rangs avec gestion des ex-æquo
  let currentRank = 0;
  let lastVotes = -1;

  return (
    <div 
      className="bg-black/80 backdrop-blur border border-gray-800 p-3 md:p-4 rounded text-white shadow-lg w-full cursor-pointer hover:border-gold/50 transition-colors group"
      onClick={onOpenFull}
    >
      {/* Header avec titre stabilisé */}
      <div className="border-b border-gray-700 pb-2 mb-2 relative">
        <div className="flex justify-between items-center min-h-[24px]">
          <h3 className="text-gold font-bold uppercase tracking-wider text-[10px] md:text-sm group-hover:underline decoration-gold underline-offset-4 whitespace-nowrap mr-2">
            ★ Top 5 Villes ★
          </h3>
          <div className="flex items-center space-x-1 md:space-x-2 shrink-0">
            <span className="text-[9px] md:text-xs text-gold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Voir tout
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); onShare(); }}
              className="text-gray-400 hover:text-gold transition-colors hidden md:block p-1 hover:bg-white/10 rounded shrink-0"
              title="Partager le classement"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ul className="space-y-1 md:space-y-2">
        {top5.map((item, i) => {
          // Logique de rang : si votes différents du précédent, on incrémente le rang
          if (item.votes !== lastVotes) {
            currentRank = i + 1;
          }
          lastVotes = item.votes;

          return (
            <li key={item.city} className="flex justify-between items-center text-[11px] md:text-sm gap-2">
              <span className="text-gray-300 whitespace-nowrap">
                #{currentRank} {item.city}
              </span>
              <span className="font-bold text-gold whitespace-nowrap">
                {item.votes} <span className="text-[8px] md:text-[10px] uppercase font-normal text-gray-500">{item.votes > 1 ? 'votes' : 'vote'}</span>
              </span>
            </li>
          );
        })}
        {top5.length === 0 && (
          <li className="text-[10px] md:text-xs text-gray-500 italic">Aucun vote pour l'instant</li>
        )}
      </ul>
    </div>
  );
};

export default Leaderboard;
