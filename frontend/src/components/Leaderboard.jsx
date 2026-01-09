import React from 'react';

const Leaderboard = ({ stats, onShare, onOpenFull }) => {
  // Sécurité : s'assurer que stats est bien un tableau
  const topStats = Array.isArray(stats) ? stats.slice(0, 5) : [];
  
  return (
    <div 
      className="bg-black/80 backdrop-blur border border-gray-800 p-4 rounded text-white shadow-lg w-full cursor-pointer hover:border-gold/50 transition-colors group"
      onClick={onOpenFull}
    >
      <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
        <h3 className="text-gold font-bold uppercase tracking-wider text-sm group-hover:underline decoration-gold underline-offset-4">Top 5 Villes</h3>
        <div className="flex items-center space-x-2">
          {/* Bouton pour voir tout (Loupe) */}
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            title="Voir tout le classement"
          >
             <span className="text-xs mr-1 hidden group-hover:inline text-gold">Voir tout</span>
          </button>

          {/* Bouton Partager (isolé du clic global pour éviter conflit) */}
          <button 
            onClick={(e) => { e.stopPropagation(); onShare(); }}
            className="text-gray-400 hover:text-gold transition-colors hidden md:block p-1 hover:bg-white/10 rounded"
            title="Partager le classement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {topStats.map((item, index) => (
          <li key={item.city} className="flex justify-between items-center text-sm">
            <span className="text-gray-300">#{index + 1} {item.city}</span>
            <span className="font-bold text-gold ml-4">{item.votes} <span className="text-[10px] uppercase font-normal text-gray-500">votes</span></span>
          </li>
        ))}
        {topStats.length === 0 && <li className="text-xs text-gray-500 italic">Aucun vote pour l'instant</li>}
      </ul>
    </div>
  );
};

export default Leaderboard;
