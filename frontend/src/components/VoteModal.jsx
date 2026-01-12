import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
const VoteModal = ({ city, onClose, onVoteSuccess, onOpenShare }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voteId, setVoteId] = useState(null);

  // Form States
  const [email, setEmail] = useState('');
  const [robotCheck, setRobotCheck] = useState('');
  
  const [details, setDetails] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    venue_proposal: '',
    intentions: [],
    message: ''
  });

  const handleIntentionChange = (value) => {
    setDetails(prev => {
      const newIntentions = prev.intentions.includes(value)
        ? prev.intentions.filter(i => i !== value)
        : [...prev.intentions, value];
      return { ...prev, intentions: newIntentions };
    });
  };

  const submitStep1 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const isPHP = !window.location.hostname.includes('vercel.app') && !window.location.hostname.includes('localhost');
      const endpoint = isPHP ? '/api/vote.php' : '/api/vote';
      
      const res = await axios.post(endpoint, { email, city, robot_check: robotCheck });
      setVoteId(res.data.id);
      
      if (res.data.status === 'already_voted') {
        // Optionnel : on peut mettre un petit message informatif
        console.log("Déjà voté, passage à l'étape détails");
      }
      
      setStep(2);
      onVoteSuccess(); // Refresh stats immediately
    } catch (err) {
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitStep2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Détection de l'environnement pour choisir le format d'URL
      const isPHP = !window.location.hostname.includes('vercel.app') && !window.location.hostname.includes('localhost');
      
      // On construit l'URL proprement selon le serveur
      const url = isPHP 
        ? `/api/vote.php?id=${voteId}` 
        : `/api/vote/${voteId}`;
      
      await axios.put(url, details);
      setStep(3); // Success Screen
    } catch (err) {
      setError("Erreur lors de l'enregistrement des détails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
        className="modal-content bg-neutral-900 border border-gold text-white p-4 md:p-6 rounded shadow-xl w-[95%] md:w-full md:max-w-md relative flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 hover:text-white text-2xl z-10">&times;</button>
        
        <h2 className="text-xl md:text-2xl font-bold text-gold mb-2 text-center uppercase tracking-widest shrink-0">{city}</h2>
        
        {step === 1 && (
          <form onSubmit={submitStep1} className="space-y-4 py-4">
            <p className="text-center text-sm mb-4 text-gray-300 font-light">Participez à la création de la tournée.<br/><span className="text-white font-medium">Soutenez votre ville !</span></p>
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1 tracking-widest font-bold">Votre Email</label>
              <input 
                type="email" 
                required 
                placeholder="fan@exemple.com"
                className="w-full bg-black border border-gray-700 p-3 text-white focus:border-gold outline-none rounded-none transition-all placeholder:text-gray-800"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Honeypot field - hidden from humans */}
            <input 
              type="text" 
              name="verification_city" 
              className="opacity-0 absolute h-0 w-0 -z-10"
              tabIndex="-1"
              autoComplete="off"
              value={robotCheck}
              onChange={e => setRobotCheck(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-3 px-4 transition uppercase mt-4"
            >
              {loading ? '...' : 'JE VOTE !'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submitStep2} className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1 py-2">
            <p className="text-center text-sm text-green-400 font-bold mb-2 uppercase tracking-tighter">Vote enregistré ! ✨</p>
            <p className="text-center text-[11px] text-gray-400 mb-4 italic">Aidez-nous à mieux organiser ce futur concert.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-1 font-bold">Nom</label>
                <input required className="w-full bg-black border border-gray-700 p-2 text-white focus:border-gold outline-none text-sm" 
                  value={details.last_name} onChange={e => setDetails({...details, last_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-1 font-bold">Prénom</label>
                <input required className="w-full bg-black border border-gray-700 p-2 text-white focus:border-gold outline-none text-sm" 
                  value={details.first_name} onChange={e => setDetails({...details, first_name: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1 font-bold">Téléphone <span className="text-[9px] lowercase font-normal opacity-50">(optionnel)</span></label>
              <input type="tel" className="w-full bg-black border border-gray-700 p-2 text-white focus:border-gold outline-none text-sm" 
                 value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1 font-bold tracking-tight">Une salle de concert à nous suggérer ?</label>
              <input placeholder="Ex: La Carène, Le Zénith..." className="w-full bg-black border border-gray-700 p-2 text-white focus:border-gold outline-none text-sm placeholder:text-gray-800" 
                 value={details.venue_proposal} onChange={e => setDetails({...details, venue_proposal: e.target.value})} />
            </div>

            <div className="space-y-2 py-2">
               <label className="block text-xs text-gray-500">Je souhaite :</label>
               {[
                 "Venir au concert",
                 "M'investir et aider le groupe",
                 "Faire venir des amis"
               ].map((opt) => (
                 <label key={opt} className="flex items-start space-x-3 text-sm cursor-pointer hover:text-gold">
                   <input 
                    type="checkbox" 
                    checked={details.intentions.includes(opt)}
                    onChange={() => handleIntentionChange(opt)}
                    className="accent-gold mt-1"
                   />
                   <span className="leading-tight">{opt}</span>
                 </label>
               ))}
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Message pour le groupe</label>
              <textarea className="w-full bg-black border border-gray-700 p-2 text-white focus:border-gold outline-none h-20" 
                 value={details.message} onChange={e => setDetails({...details, message: e.target.value})} />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 px-4 transition uppercase mt-2 sticky bottom-0"
            >
              {loading ? '...' : 'Valider'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <h3 className="text-xl text-gold mb-2 font-bold">MERCI !</h3>
            <p className="mb-6 text-gray-300 text-sm">Ton soutien est précieux.</p>
            
            <button 
              onClick={() => { onClose(); onOpenShare(); }}
              className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-3 rounded uppercase tracking-wide mb-4 transition"
            >
              PARTAGER MON VOTE
            </button>

            <button onClick={onClose} className="text-xs underline text-gray-500 hover:text-white">Fermer</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VoteModal;
