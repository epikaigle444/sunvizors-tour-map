import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

// SVG Logo Component for consistency
const SunvizorsLogo = ({ className }) => (
  <div className={`flex flex-col items-center ${className}`}>
    {/* Stylized Star */}
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-gold w-16 h-16 md:w-24 md:h-24 mb-2 drop-shadow-[0_0_10px_rgba(204,165,44,0.5)]">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
    <h1 className="font-black tracking-[0.2em] text-white text-xl md:text-3xl uppercase text-center drop-shadow-md">
      The <span className="text-gold">Sunvizors</span>
    </h1>
  </div>
);

const WelcomeScreen = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSidebar, setIsSidebar] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setIsSidebar(true), 500); // Wait for exit animation
  };

  const captureAndShare = async (elementId, filename) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Hide UI elements that shouldn't be in screenshot
    const uiElements = document.querySelectorAll('.no-capture');
    uiElements.forEach(el => el.style.opacity = '0');

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#1a1a1a',
        useCORS: true,
        scale: 2 // High res
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${filename}.png`;
      link.click();
    } catch (err) {
      console.error("Capture failed", err);
    } finally {
       uiElements.forEach(el => el.style.opacity = '1');
    }
  };

  const shareText = "Je viens de voter pour ma ville ! Viens soutenir la tournée de The Sunvizors ici : " + window.location.href;

  return (
    <>
      {/* 1. INITIAL MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <div className="relative flex flex-col items-center max-w-lg w-full">
              
              {/* Logo floating OUTSIDE the modal on the blur */}
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 scale-110"
              >
                <SunvizorsLogo />
              </motion.div>

              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-neutral-900 border border-gold/30 p-8 rounded-xl shadow-2xl text-center relative w-full"
              >
                <h2 className="text-2xl font-bold text-white mb-4 uppercase">Construisons la tournée ensemble</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Nous préparons notre prochaine tournée et nous voulons venir jouer près de chez vous. 
                  <br/><br/>
                  <strong className="text-gold">Votez pour votre ville</strong>, proposez des salles et aidez-nous à organiser des concerts inoubliables !
                </p>
                
                <button 
                  onClick={handleClose}
                  className="bg-gold text-black font-black py-3 px-8 rounded-full text-lg hover:bg-white transition-all shadow-[0_0_15px_rgba(204,165,44,0.4)] uppercase tracking-wider"
                >
                  Accéder à la carte
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SIDEBAR (Appears after modal closes) */}
      <AnimatePresence>
        {isSidebar && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed top-0 left-0 h-full w-[280px] z-[900] bg-neutral-900/90 backdrop-blur border-r border-gold/20 p-6 flex flex-col no-capture shadow-2xl transform transition-transform md:translate-x-0 -translate-x-full md:relative md:block hidden pointer-events-auto"
            style={{ display: window.innerWidth < 768 ? 'none' : 'flex' }}
          >
            {/* Branding Sidebar */}
            <div className="mb-8">
               <SunvizorsLogo className="scale-75 origin-left items-start" />
            </div>

            <div className="flex-1 space-y-6">
               <div className="p-4 bg-black/40 rounded border border-gray-800">
                  <h3 className="text-gold text-sm font-bold uppercase mb-2">Le concept</h3>
                  <p className="text-xs text-gray-400">Votez pour faire venir le groupe dans votre ville. Les villes avec le plus de votes seront prioritaires pour la tournée 2026.</p>
               </div>

               <div className="space-y-3">
                  <h3 className="text-white text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-1">Partager</h3>
                  
                  <button onClick={() => captureAndShare('root', 'carte-sunvizors')} className="w-full text-left text-xs text-gray-300 hover:text-gold flex items-center group">
                    <span className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-gold group-hover:text-black transition">📸</span>
                    Télécharger la Carte
                  </button>

                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="w-full text-left text-xs text-gray-300 hover:text-gold flex items-center group">
                    <span className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-blue-400 group-hover:text-white transition">X</span>
                    Partager sur X (Twitter)
                  </a>

                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="w-full text-left text-xs text-gray-300 hover:text-gold flex items-center group">
                    <span className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition">f</span>
                    Partager sur Facebook
                  </a>
               </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-800">
                <p className="text-[10px] text-gray-600 text-center">© 2026 The Sunvizors</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Branding (Top Left) when sidebar is hidden */}
      {!isOpen && (
        <div className="md:hidden fixed top-4 left-4 z-[900] pointer-events-none">
           <div className="flex flex-col items-start pointer-events-auto">
             <span className="text-gold text-2xl drop-shadow-md">★</span>
             <span className="text-white font-black text-xs uppercase tracking-widest drop-shadow-md leading-none">The<br/>Sunvizors</span>
           </div>
        </div>
      )}
    </>
  );
};

export default WelcomeScreen;
