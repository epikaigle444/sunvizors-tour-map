import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ onClose, stats }) => {
  const [expandedCity, setExpandedCity] = useState(null);
  const [cityDetails, setCityDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const isPHP = !window.location.hostname.includes('vercel.app') && !window.location.hostname.includes('localhost');

  const downloadCSV = () => {
    const baseUrl = axios.defaults.baseURL || '';
    const endpoint = isPHP ? '/api/export.php' : '/api/export_csv';
    window.open(`${baseUrl}${endpoint}?pass=sun`, '_blank');
  };

  const handleCityClick = async (city) => {
    if (expandedCity === city) {
      setExpandedCity(null);
      return;
    }

    setExpandedCity(city);
    setLoadingDetails(true);
    try {
      const url = isPHP 
        ? `/api/stats.php?city=${encodeURIComponent(city)}&pass=sun` 
        : `/api/votes/${encodeURIComponent(city)}?pass=sun`;
        
      const res = await axios.get(url);
      setCityDetails(res.data);
    } catch (err) {
      console.error("Error fetching city details", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteVote = async (id) => {
    if (!window.confirm("Supprimer ce vote ?")) return;
    try {
      const url = isPHP ? `/api/vote.php?id=${id}&pass=sun` : `/api/vote/${id}?pass=sun`;
      await axios.delete(url);
      setCityDetails(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error("Error deleting vote", err);
    }
  };

  let currentRank = 0;
  let lastVotes = -1;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-['Montserrat']">
      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/20 pb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gold uppercase tracking-wider">Sunvizors Admin</h1>
            <p className="text-gray-400 text-xs uppercase tracking-widest mt-1 font-medium">Gestion de la tournée 2026</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
                onClick={downloadCSV}
                className="flex-1 md:flex-none bg-white hover:bg-gold text-black px-6 py-2.5 font-bold transition-colors uppercase text-sm tracking-wider rounded shadow-lg"
            >
              Export CSV
            </button>
            <button 
                onClick={onClose}
                className="text-gray-300 hover:text-white text-xs uppercase tracking-widest transition-colors font-bold border border-white/10 px-4 py-2 rounded hover:bg-white/5"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* LISTE DES VILLES */}
        <div className="bg-neutral-900/40 rounded-lg border border-white/10 overflow-hidden flex flex-col h-[78vh] shadow-2xl">
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {Array.isArray(stats) && stats.map((item, index) => {
              if (item.votes !== lastVotes) {
                currentRank = index + 1;
              }
              lastVotes = item.votes;
              
              return (
                <div key={item.city} className="border-b border-white/5 last:border-0">
                  <div 
                    onClick={() => handleCityClick(item.city)}
                    className={`flex items-center justify-between cursor-pointer p-5 transition-all hover:bg-white/5 ${expandedCity === item.city ? 'bg-white/10 border-l-4 border-gold' : ''}`}
                  >
                    <div className="flex items-center space-x-6">
                      <span className={`font-mono text-lg w-8 ${currentRank <= 3 ? 'text-gold font-black scale-110' : 'text-gray-500 font-bold'}`}>
                        #{currentRank}
                      </span>
                      <span className="text-lg md:text-xl font-bold tracking-tight text-gray-100">{item.city}</span>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <span className="text-xl md:text-2xl font-black text-gold">{item.votes}</span>
                        <span className="text-[10px] uppercase text-gray-400 font-bold block leading-none mt-1">votes</span>
                      </div>
                      <span className={`transition-transform duration-300 ${expandedCity === item.city ? 'rotate-180 text-gold' : 'text-gray-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* DETAILS */}
                  {expandedCity === item.city && (
                    <div className="bg-black/60 p-2 md:p-6 animate-fadeIn border-t border-white/10">
                      {loadingDetails ? (
                        <div className="py-12 text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-gold"></div>
                        </div>
                      ) : (
                        <div className="relative">
                           {cityDetails.length > 0 ? (
                             <>
                               {/* VERSION DESKTOP */}
                               <div className="hidden md:block overflow-x-auto rounded border border-white/10 bg-black/20">
                                 <table className="w-full text-left table-fixed border-collapse">
                                   <thead className="text-[11px] uppercase tracking-widest text-gray-400 bg-neutral-800/50">
                                     <tr>
                                       <th className="py-4 px-4 w-[25%]">Votant / Contact</th>
                                       <th className="py-4 px-4 w-[15%]">Salle</th>
                                       <th className="py-4 px-4 w-[20%]">Souhaits</th>
                                       <th className="py-4 px-4 w-[25%]">Message</th>
                                       <th className="py-4 px-4 w-[120px] text-right">Date</th>
                                       <th className="py-4 px-2 w-[50px]"></th>
                                     </tr>
                                   </thead>
                                   <tbody className="divide-y divide-white/10">
                                     {cityDetails.map((detail) => (
                                       <tr key={detail.id} className="hover:bg-white/[0.05] transition-colors">
                                         <td className="py-5 px-4 border-r border-white/5">
                                            <div className="font-bold text-white text-base">{detail.first_name} {detail.last_name}</div>
                                            <div className="text-gold font-medium text-xs mt-1 select-all">{detail.email}</div>
                                            <div className="text-white text-xs mt-1 font-bold">{detail.phone || "-"}</div>
                                         </td>
                                         <td className="py-5 px-4 border-r border-white/5 text-gray-100 font-medium">
                                            {detail.venue_proposal || <span className="text-gray-600 italic">Non précisé</span>}
                                         </td>
                                         <td className="py-5 px-4 border-r border-white/5">
                                            <div className="flex flex-wrap gap-1.5">
                                               {(Array.isArray(detail.intentions) ? detail.intentions : (detail.intentions || "").split(', ')).map((tag, tIdx) => (
                                                 tag && <span key={tIdx} className="bg-gold/20 text-white text-[10px] px-2 py-1 rounded-sm border border-gold/30 uppercase font-bold">{tag}</span>
                                               ))}
                                            </div>
                                         </td>
                                         <td className="py-5 px-4 border-r border-white/5">
                                            <div className="max-h-24 overflow-y-auto pr-2 custom-scrollbar text-sm text-gray-200 leading-relaxed font-medium">
                                               {detail.message || <span className="text-gray-600 italic">Pas de message</span>}
                                            </div>
                                         </td>
                                         <td className="py-5 px-4 text-right text-gray-300 text-xs font-bold whitespace-nowrap tabular-nums">
                                            {detail.created_at ? new Date(detail.created_at).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: '2-digit'}) : "-"}
                                         </td>
                                         <td className="py-5 px-2 text-center">
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteVote(detail.id); }} className="text-gray-500 hover:text-red-500 transition-all hover:scale-125">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                              </svg>
                                            </button>
                                         </td>
                                       </tr>
                                     ))}
                                   </tbody>
                                 </table>
                               </div>

                               {/* VERSION MOBILE */}
                               <div className="md:hidden space-y-4">
                                 {cityDetails.map((detail) => (
                                   <div key={detail.id} className="bg-white/[0.05] border border-white/10 p-4 rounded-lg relative shadow-inner">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteVote(detail.id); }} 
                                        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 p-2 bg-black/20 rounded-full"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                      
                                      <div className="mb-3">
                                        <div className="font-bold text-white text-base">{detail.first_name} {detail.last_name}</div>
                                        <div className="text-gold text-xs font-bold mt-0.5">{detail.email}</div>
                                        {detail.phone && <div className="text-white text-xs font-bold mt-1">{detail.phone}</div>}
                                      </div>

                                      <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b border-white/10">
                                        <div>
                                          <div className="text-[10px] uppercase text-gray-500 font-black tracking-widest">Salle</div>
                                          <div className="text-xs text-gray-200 font-bold">{detail.venue_proposal || "-"}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-[10px] uppercase text-gray-500 font-black tracking-widest">Date</div>
                                          <div className="text-xs text-gray-400 font-bold">{detail.created_at ? new Date(detail.created_at).toLocaleDateString('fr-FR') : "-"}</div>
                                        </div>
                                      </div>

                                      <div className="mb-3">
                                        <div className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-2">Souhaits</div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {(Array.isArray(detail.intentions) ? detail.intentions : (detail.intentions || "").split(', ')).map((tag, tIdx) => (
                                            tag && <span key={tIdx} className="bg-gold/20 text-white text-[9px] px-2 py-0.5 rounded-sm border border-gold/30 uppercase font-black">{tag}</span>
                                          ))}
                                        </div>
                                      </div>

                                      {detail.message && (
                                        <div>
                                          <div className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-1.5">Message</div>
                                          <div className="text-sm text-gray-200 leading-relaxed font-medium bg-black/30 p-3 rounded border-l-2 border-gold/50">
                                            {detail.message}
                                          </div>
                                        </div>
                                      )}
                                   </div>
                                 ))}
                               </div>
                             </>
                           ) : (
                             <p className="py-10 text-center text-gray-500 text-xs italic tracking-widest uppercase font-bold">Aucune donnée pour le moment</p>
                           )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
