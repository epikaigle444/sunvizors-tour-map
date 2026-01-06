import React from 'react';

const Leaderboard = ({ stats }) => {
  const topStats = stats.slice(0, 5);
  
  return (
    <div className="absolute top-4 left-4 z-[1000] bg-black/80 backdrop-blur border border-gray-800 p-4 rounded min-w-[200px] text-white">
      <h3 className="text-gold font-bold uppercase tracking-wider text-sm mb-3 border-b border-gray-700 pb-2">Top 5 Villes</h3>
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
