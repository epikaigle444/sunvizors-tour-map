import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const VoteModal = ({ city, onClose, onVoteSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voteId, setVoteId] = useState(null);

  // Form States
  const [email, setEmail] = useState('');
  
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
      const res = await axios.post('/api/vote', { email, city });
      setVoteId(res.data.id);
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
      await axios.put(`/api/vote/${voteId}`, details);
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
        className="bg-neutral-900 border border-gold text-white p-4 md:p-6 rounded shadow-xl w-[95%] md:w-full md:max-w-md relative flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 hover:text-white text-2xl z-10">&times;</button>
        
        <h2 className="text-xl md:text-2xl font-bold text-gold mb-2 text-center uppercase tracking-widest shrink-0">{city}</h2>
        
        {step === 1 && (
          <form onSubmit={submitStep1} className="space-y-4 py-4">
            <p className="text-center text-sm mb-4 text-gray-300">Vote pour ta ville pour faire venir The Sunvizors !</p>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Email</label>
              <input 
                type="email" 
                required 
                className="w-full bg-black border border-gray-700 p-3 text-white focus:border-gold outline-none rounded-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
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
            <p className="text-center text-sm text-green-400 font-bold mb-2">Vote pris en compte ! Dis-nous en plus.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nom</label>
                <input required className="w-full bg-black border border-gray-700 p-2 text-white focus:border-gold outline-none" 
                  value={details.last_name} onChange={e => setDetails({...details, last_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Prénom</label>
                <input required className="w-full bg-black border border-gray-700 p-2 text-white focus:border-gold outline-none" 
                  value={details.first_name} onChange={e => setDetails({...details, first_name: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Téléphone</label>
              <input type="tel" required className="w-full bg-black border border-gray-700 p-2 text-white focus:border-gold outline-none" 
                 value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Propose une salle de concert</label>
              <input className="w-full bg-black border border-gray-700 p-2 text-white focus:border-gold outline-none" 
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
          <div className="text-center py-8">
            <h3 className="text-xl text-gold mb-4">MERCI !</h3>
            <p className="mb-6 text-gray-300">Ton soutien est précieux.</p>
            
            <div className="flex flex-col items-center space-y-4 mb-8">
              {/* Social Share Buttons */}
              <div className="flex justify-center space-x-6 w-full">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-center font-bold uppercase text-xs tracking-widest transition">Facebook</a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Je viens de voter pour ${city} pour le concert de The Sunvizors !`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded text-center font-bold uppercase text-xs tracking-widest transition">Twitter</a>
              </div>
              
              {/* Bouton Inviter des amis (Mobile natif ou Email) */}
              <button 
                onClick={() => {
                   if (navigator.share) {
                     navigator.share({
                       title: 'The Sunvizors Tour Vote',
                       text: 'Viens voter pour ta ville pour la tournée de The Sunvizors !',
                       url: window.location.href,
                     });
                   } else {
                     window.location.href = `mailto:?subject=Vote pour le concert de The Sunvizors&body=Salut, viens voter pour ta ville ici : ${window.location.href}`;
                   }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold uppercase text-xs tracking-widest transition flex items-center justify-center space-x-2"
              >
                <span>✉️ Inviter des amis</span>
              </button>

              <div className="w-full">
                <p className="text-[10px] uppercase text-gray-500 mb-2 text-center">Ou copier le lien :</p>
                <div className="flex border border-gray-700 bg-black">
                  <input 
                    readOnly 
                    value={window.location.href} 
                    className="bg-transparent text-[10px] px-2 flex-1 outline-none text-gray-400 truncate"
                  />
                  <button 
                    onClick={(e) => {
                      navigator.clipboard.writeText(window.location.href);
                      e.target.innerText = "COPIÉ !";
                      setTimeout(() => { e.target.innerText = "COPIER"; }, 2000);
                    }}
                    className="bg-gray-800 px-3 py-2 text-[10px] font-bold hover:bg-gold hover:text-black transition-colors shrink-0"
                  >
                    COPIER
                  </button>
                </div>
              </div>
            </div>

            <button onClick={onClose} className="text-sm underline text-gray-500 hover:text-white">Fermer</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VoteModal;
