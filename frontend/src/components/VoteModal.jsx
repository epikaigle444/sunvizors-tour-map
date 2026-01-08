import html2canvas from 'html2canvas';

const VoteModal = ({ city, onClose, onVoteSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voteId, setVoteId] = useState(null);
  
  // Share States
  const [shareLoading, setShareLoading] = useState(false);

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

  // --- SHARE LOGIC ---
  const handleShare = async (type) => {
    setShareLoading(true);
    let elementId = null;
    let filename = 'sunvizors-share.png';
    let text = "Je viens de voter pour ma ville ! Viens soutenir The Sunvizors !";
    let url = window.location.href;

    if (type === 'leaderboard') {
      elementId = 'leaderboard-container';
      filename = 'classement-sunvizors.png';
      text = "Regarde le classement des villes pour la tournée de The Sunvizors !";
    } else if (type === 'map') {
      elementId = 'map-container';
      filename = 'carte-sunvizors.png';
      text = "Regarde la carte de la tournée participative !";
    } else if (type === 'invite') {
      // Invite logic doesn't need screenshot of DOM, just link with param
      const inviteUrl = `${window.location.origin}?city=${encodeURIComponent(city)}`;
      const inviteText = `Viens aider tes amis et vote pour ${city} pour le concert de The Sunvizors !`;
      
      // Open native share if available (Mobile)
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'The Sunvizors Tour',
            text: inviteText,
            url: inviteUrl
          });
        } catch (err) { console.log('Share canceled'); }
      } else {
        // Fallback Desktop
        navigator.clipboard.writeText(inviteText + " " + inviteUrl);
        alert("Lien d'invitation copié !");
      }
      setShareLoading(false);
      return;
    }

    // Capture Logic for Map/Leaderboard
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        try {
          // Temporarily hide modal to not capture it if capturing map
          const modal = document.querySelector('.modal-content');
          if (modal && type === 'map') modal.style.opacity = '0';

          const canvas = await html2canvas(element, { useCORS: true, allowTaint: true });
          
          if (modal && type === 'map') modal.style.opacity = '1';

          const image = canvas.toDataURL("image/png");
          
          // Download the image
          const link = document.createElement('a');
          link.href = image;
          link.download = filename;
          link.click();

          // Open Twitter intent with text (user has to attach image manually on desktop)
          setTimeout(() => {
             const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
             window.open(twitterUrl, '_blank');
          }, 1000);

        } catch (err) {
          console.error("Capture failed", err);
          alert("Impossible de générer l'image. Veuillez réessayer.");
        }
      }
    }
    setShareLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="modal-content bg-neutral-900 border border-gold text-white p-4 md:p-6 rounded shadow-xl w-[95%] md:w-full md:max-w-md relative flex flex-col max-h-[90vh]"
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
          <div className="text-center py-6 overflow-y-auto">
            <h3 className="text-xl text-gold mb-2 font-bold">MERCI !</h3>
            <p className="mb-6 text-gray-300 text-sm">Ton soutien est précieux.</p>
            
            <div className="space-y-3 w-full px-4 mb-6">
              <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest border-b border-gray-800 pb-2 mb-4">Partager</p>

              {/* Button A: Partager le classement */}
              <button 
                onClick={() => handleShare('leaderboard')}
                disabled={shareLoading}
                className="w-full bg-gray-800 hover:bg-gold hover:text-black text-white py-3 rounded flex items-center justify-center space-x-3 transition group"
              >
                <span className="text-lg">🏆</span>
                <span className="text-xs font-bold uppercase tracking-wide">Partager le classement</span>
              </button>

              {/* Button B: Inviter ses amis */}
              <button 
                onClick={() => handleShare('invite')}
                disabled={shareLoading}
                className="w-full bg-gray-800 hover:bg-gold hover:text-black text-white py-3 rounded flex items-center justify-center space-x-3 transition group"
              >
                <span className="text-lg">💌</span>
                <span className="text-xs font-bold uppercase tracking-wide">Inviter des amis</span>
              </button>

              {/* Button C: Partager la carte */}
              <button 
                onClick={() => handleShare('map')}
                disabled={shareLoading}
                className="w-full bg-gray-800 hover:bg-gold hover:text-black text-white py-3 rounded flex items-center justify-center space-x-3 transition group"
              >
                <span className="text-lg">🗺️</span>
                <span className="text-xs font-bold uppercase tracking-wide">Partager la carte</span>
              </button>
            </div>

            <button onClick={onClose} className="text-xs underline text-gray-500 hover:text-white mt-2">Fermer</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VoteModal;
