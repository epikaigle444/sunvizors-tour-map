import React from 'react';
import { motion } from 'framer-motion';

const InfoModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-neutral-900 border border-gold text-white p-6 rounded-xl shadow-2xl max-w-sm w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
        <h2 className="text-xl font-bold text-gold mb-6 text-center uppercase tracking-widest">À propos</h2>

        <div className="space-y-6">
           <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-gold text-xs font-bold uppercase mb-2 tracking-widest border-b border-gray-700 pb-1">Le concept</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                <strong className="text-white">The Sunvizors</strong> préparent leur tournée 2026. Votez pour faire venir le groupe dans votre ville !
              </p>
           </div>
           
           <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-gold text-xs font-bold uppercase mb-2 tracking-widest border-b border-gray-700 pb-1">Comment participer ?</h3>
              <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4">
                <li>Cliquez sur un point sur la carte</li>
                <li>Entrez votre email pour voter</li>
                <li>Partagez pour grimper au classement !</li>
              </ul>
           </div>
        </div>
        
        <div className="mt-6 text-center">
            <button onClick={onClose} className="text-xs underline text-gray-500 hover:text-white">Fermer</button>
        </div>

      </motion.div>
    </div>
  );
};

export default InfoModal;
