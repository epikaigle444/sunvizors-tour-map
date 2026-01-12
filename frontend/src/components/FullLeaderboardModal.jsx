import React from 'react';
import { motion } from 'framer-motion';

const FullLeaderboardModal = ({ onClose, stats }) => {
  let currentRank = 0;
  let lastVotes = -1;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
        className="bg-neutral-900 border border-gold text-white p-6 rounded-xl shadow-2xl max-w-md w-full relative h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
        <h2 className="text-xl font-bold text-gold mb-6 text-center uppercase tracking-widest shrink-0">Classement Complet</h2>

        <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-2">
          {Array.isArray(stats) && stats.map((item, index) => {
            if (item.votes !== lastVotes) {
              currentRank = index + 1;
            }
            lastVotes = item.votes;

            return (
              <div key={item.city} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/10 hover:border-gold/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className={`font-mono font-bold w-8 text-center ${currentRank <= 3 ? 'text-gold text-lg' : 'text-gray-500'}`}>
                    #{currentRank}
                  </span>
                  <span className="text-sm font-medium">{item.city}</span>
                </div>
                <span className="text-xs font-bold text-gold bg-black/30 px-2 py-1 rounded-full whitespace-nowrap">
                  {item.votes} {item.votes > 1 ? 'votes' : 'vote'}
                </span>
              </div>
            );
          })}
          
          {stats.length === 0 && (
            <p className="text-center text-gray-500 py-10">Aucun vote pour le moment.</p>
          )}
        </div>
        
        <div className="mt-4 text-center shrink-0 pt-4 border-t border-gray-800">
            <button onClick={onClose} className="text-xs underline text-gray-500 hover:text-white">Fermer</button>
        </div>

      </motion.div>
    </div>
  );
};

export default FullLeaderboardModal;