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
        
        {/* HEADER SIMPLE - Responsive stack */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/10 pb-6 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gold uppercase tracking-wider">Sunvizors Admin</h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">Gestion de la tournée 2026</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-center">
            <button 
                onClick={downloadCSV}
                className="flex-1 md:flex-none bg-white hover:bg-gold text-black px-5 py-2 font-bold transition-colors uppercase text-xs tracking-wider"
            >
              Export CSV
            </button>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* LISTE DES VILLES */}
        <div className="bg-neutral-900/40 rounded border border-white/5 overflow-hidden flex flex-col h-[78vh]">
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
                    className={`flex items-center justify-between cursor-pointer p-4 transition-all hover:bg-white/5 ${expandedCity === item.city ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <span className={`font-mono text-xs md:text-sm w-5 md:w-6 ${currentRank <= 3 ? 'text-gold font-bold' : 'text-gray-600'}`}>
                        #{currentRank}
                      </span>
                      <span className="text-sm md:text-lg font-bold tracking-tight text-white truncate max-w-[150px] md:max-w-none">{item.city}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 md:space-x-6">
                      <div className="text-right">
                        <span className="text-base md:text-lg font-bold text-gold">{item.votes}</span>
                        <span className="text-[8px] md:text-[10px] uppercase text-gray-500 block leading-none">votes</span>
                      </div>
                      <span className={`text-gray-600 transition-transform duration-300 ${expandedCity === item.city ? 'rotate-180 text-gold' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* DETAILS */}
                  {expandedCity === item.city && (
                    <div className="bg-black/40 p-2 md:p-4 animate-fadeIn border-t border-white/5">
                      {loadingDetails ? (
                        <div className="py-8 text-center">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-gold"></div>
                        </div>
                      ) : (
                        <div className="relative">
                           {cityDetails.length > 0 ? (
                             <>
                               {/* VERSION DESKTOP TABLEAU (Visible > md) */}
                               <div className="hidden md:block overflow-x-auto rounded border border-white/10">
                                 <table className="w-full text-left text-xs table-fixed border-collapse">
                                   <thead className="text-[10px] uppercase tracking-widest text-gray-500 bg-neutral-800/30">
                                     <tr>
                                       <th className="py-3 px-4 w-[25%]">Votant / Contact</th>
                                       <th className="py-3 px-4 w-[15%]">Salle</th>
                                       <th className="py-3 px-4 w-[20%]">Souhaits</th>
                                       <th className="py-3 px-4 w-[25%]">Message</th>
                                       <th className="py-3 px-4 w-[100px] text-right">Date</th>
                                       <th className="py-3 px-2 w-[40px]"></th>
                                     </tr>
                                   </thead>
                                   <tbody className="divide-y divide-white/5">
                                     {cityDetails.map((detail) => (
                                       <tr key={detail.id} className="hover:bg-white/[0.02] transition-colors">
                                         <td className="py-4 px-4 border-r border-white/5">
                                            <div className="font-bold text-gray-200">{detail.first_name} {detail.last_name}</div>
                                            <div className="text-gold opacity-80 text-[10px] truncate">{detail.email}</div>
                                            <div className="text-gray-500 text-[10px] mt-0.5">{detail.phone || "-"}</div>
                                         </td>
                                         <td className="py-4 px-4 border-r border-white/5 text-gray-300 italic">
                                            {detail.venue_proposal || <span className="opacity-20">-</span>}
                                         </td>
                                         <td className="py-4 px-4 border-r border-white/5">
                                            <div className="flex flex-wrap gap-1">
                                               {(Array.isArray(detail.intentions) ? detail.intentions : (detail.intentions || "").split(', ')).map((tag, tIdx) => (
                                                 tag && <span key={tIdx} className="bg-white/5 px-1.5 py-0.5 rounded text-[8px] uppercase border border-white/10 text-gray-400">{tag}</span>
                                               ))}
                                            </div>
                                         </td>
                                         <td className="py-4 px-4 border-r border-white/5 text-gray-400 leading-relaxed overflow-hidden">
                                            <div className="max-h-16 overflow-y-auto pr-1 text-[10px] custom-scrollbar break-words">
                                               {detail.message || "-"}
                                            </div>
                                         </td>
                                         <td className="py-4 px-4 text-right text-gray-600 text-[9px] whitespace-nowrap tabular-nums">
                                            {detail.created_at ? new Date(detail.created_at).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: '2-digit'}) : "-"}
                                         </td>
                                         <td className="py-4 px-2 text-center">
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteVote(detail.id); }} className="text-gray-700 hover:text-red-500 transition-colors">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                              </svg>
                                            </button>
                                         </td>
                                       </tr>
                                     ))}
                                   </tbody>
                                 </table>
                               </div>

                               {/* VERSION MOBILE CARTES (Visible < md) */}
                               <div className="md:hidden space-y-3">
                                 {cityDetails.map((detail) => (
                                   <div key={detail.id} className="bg-white/[0.03] border border-white/10 p-3 rounded relative">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteVote(detail.id); }} 
                                        className="absolute top-2 right-2 text-gray-600 hover:text-red-500 p-1"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                      
                                      <div className="mb-2">
                                        <div className="font-bold text-gray-200 text-sm">{detail.first_name} {detail.last_name}</div>
                                        <div className="text-gold text-[10px]">{detail.email}</div>
                                        {detail.phone && <div className="text-gray-500 text-[10px]">{detail.phone}</div>}
                                      </div>

                                      <div className="grid grid-cols-2 gap-2 mb-2 pb-2 border-b border-white/5">
                                        <div>
                                          <div className="text-[8px] uppercase text-gray-500 tracking-wider">Salle</div>
                                          <div className="text-[10px] text-gray-300 italic">{detail.venue_proposal || "-"}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-[8px] uppercase text-gray-500 tracking-wider">Date</div>
                                          <div className="text-[10px] text-gray-500">{detail.created_at ? new Date(detail.created_at).toLocaleDateString('fr-FR') : "-"}</div>
                                        </div>
                                      </div>

                                      <div className="mb-2">
                                        <div className="text-[8px] uppercase text-gray-500 tracking-wider mb-1">Souhaits</div>
                                        <div className="flex flex-wrap gap-1">
                                          {(Array.isArray(detail.intentions) ? detail.intentions : (detail.intentions || "").split(', ')).map((tag, tIdx) => (
                                            tag && <span key={tIdx} className="bg-white/5 px-1.5 py-0.5 rounded text-[8px] uppercase border border-white/10 text-gray-400">{tag}</span>
                                          ))}
                                        </div>
                                      </div>

                                      {detail.message && (
                                        <div>
                                          <div className="text-[8px] uppercase text-gray-500 tracking-wider mb-1">Message</div>
                                          <div className="text-[10px] text-gray-400 leading-relaxed italic border-l border-gold/30 pl-2">
                                            {detail.message}
                                          </div>
                                        </div>
                                      )}
                                   </div>
                                 ))}
                               </div>
                             </>
                           ) : (
                             <p className="py-6 text-center text-gray-600 text-xs italic tracking-widest uppercase">Aucune donnée</p>
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
