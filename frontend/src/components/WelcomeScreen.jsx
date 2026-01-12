import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeScreen = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [inviteCity, setInviteCity] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    const hasSeenIntro = localStorage.getItem('sunvizors_intro_seen');

    if (hasSeenIntro) {
      // Si déjà vu, on ne montre plus rien
      onStart();
      return;
    }

    if (cityParam) {
      setInviteCity(cityParam);
    }
    
    setIsVisible(true);
  }, []);

  const handleStart = () => {
    localStorage.setItem('sunvizors_intro_seen', 'true');
    setIsVisible(false);
    setTimeout(onStart, 500); // Wait for animation
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-black/95 flex flex-col items-center justify-center p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <img 
              src="https://thesunvizors.com/wp-content/uploads/2024/12/OR-THE-SUNVIZORS-2018-seul-sansFOND.png" 
              alt="The Sunvizors Logo" 
              className="w-64 md:w-80 mx-auto drop-shadow-[0_0_15px_rgba(204,165,44,0.3)]"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-lg"
          >
            {inviteCity && (
               <div className="bg-gold/10 border border-gold/50 p-4 rounded mb-6 shadow-[0_0_20px_rgba(204,165,44,0.1)]">
                 <p className="text-gold font-bold text-lg uppercase tracking-widest mb-1">Invitation Spéciale !</p>
                 <p className="text-white text-md">Viens aider tes amis et vote pour <span className="font-bold text-gold underline">{inviteCity}</span> !</p>
               </div>
            )}

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter uppercase">
              ★ LA TOURNÉE <span className="text-gold">PARTICIPATIVE</span> ★
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed font-light">
              Où souhaitez-vous nous voir en 2026 ?<br/>
              <span className="text-white font-medium">Votez pour votre ville</span> et dessinons ensemble la route de nos prochains concerts.
            </p>

            <button 
              onClick={handleStart}
              className="group relative px-10 py-5 bg-transparent border-2 border-gold text-gold font-bold uppercase tracking-[0.2em] transition-all hover:bg-gold hover:text-black shadow-[0_0_20px_rgba(247,220,111,0.1)] active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full bg-gold/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></span>
              {inviteCity ? "JE VOTE POUR " + inviteCity.toUpperCase() : "ACCÉDER À LA CARTE"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;