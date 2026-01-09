import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoginScreen = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mot de passe en dur (Tu pourras le changer ici)
    // Pour une sécurité maximale, on utiliserait des variables d'environnement, 
    // mais pour ce projet, c'est suffisant.
    if (password === 'sun') { 
      onLoginSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-neutral-900 border border-gold p-8 rounded-xl shadow-[0_0_30px_rgba(204,165,44,0.2)] max-w-sm w-full text-center"
      >
        <h2 className="text-2xl font-bold text-gold mb-6 uppercase tracking-widest">Accès Admin</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className="w-full bg-black border border-gray-700 p-3 text-white focus:border-gold outline-none text-center tracking-widest placeholder-gray-600 rounded"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2">Mot de passe incorrect</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-gold hover:bg-white hover:text-black text-black font-bold py-3 rounded transition-all uppercase tracking-wide"
          >
            Entrer
          </button>
        </form>

        <a href="/" className="block mt-6 text-gray-500 text-xs hover:text-white underline">
          Retour au site
        </a>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
