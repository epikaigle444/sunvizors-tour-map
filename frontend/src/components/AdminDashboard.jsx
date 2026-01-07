import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ onClose, stats }) => {
  const [expandedCity, setExpandedCity] = useState(null);
  const [cityDetails, setCityDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const downloadCSV = () => {
    const baseUrl = axios.defaults.baseURL || '';
    window.open(`${baseUrl}/api/export_csv`, '_blank');
  };

  const handleCityClick = async (city) => {
    if (expandedCity === city) {
      setExpandedCity(null);
      return;
    }

    setExpandedCity(city);
    setLoadingDetails(true);
    try {
      const res = await axios.get(`/api/votes/${city}`);
      setCityDetails(res.data);
    } catch (err) {
      console.error("Error fetching city details", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gold/30 pb-4">
          <h1 className="text-3xl font-bold text-gold uppercase tracking-tighter">Sunvizors Tour Admin</h1>
          <div className="space-x-4">
            <button 
                onClick={downloadCSV}
                className="bg-gold text-black px-4 py-2 font-bold hover:bg-yellow-600 transition"
            >
              EXPORTER CSV
            </button>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white underline text-sm"
            >
              Retour à la carte
            </button>
          </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded border border-gray-800 shadow-xl flex flex-col h-[70vh]">
          <h2 className="text-xl font-bold mb-4 text-gray-300">Statistiques de Vote <span className="text-sm font-normal text-gray-500 ml-2">(Cliquez sur une ville pour voir les détails)</span></h2>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {stats.map((item, index) => (
              <div key={item.city} className="border-b border-gray-800 last:border-0 pb-2">
                <div 
                  onClick={() => handleCityClick(item.city)}
                  className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gold font-mono w-6 text-sm">#{index+1}</span>
                    <span className="text-base font-bold">{item.city}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:block h-1.5 bg-gold/10 w-24 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gold" 
                        style={{ width: `${(item.votes / stats[0].votes) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-lg text-gold">{item.votes} votes</span>
                    <span className="text-gray-500 transform transition-transform duration-200" style={{ transform: expandedCity === item.city ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </div>
                </div>

                {expandedCity === item.city && (
                  <div className="mt-2 pl-2 md:pl-4 pr-2 py-4 bg-black/30 rounded border-l-2 border-gold/50">
                    {loadingDetails ? (
                      <p className="text-sm text-gray-400">Chargement...</p>
                    ) : (
                      <>
                         {cityDetails.length > 0 ? (
                           <div className="overflow-x-auto">
                             <table className="w-full text-left text-xs text-gray-300 min-w-[500px]">
                               <thead className="text-gray-500 border-b border-gray-700">
                                 <tr>
                                   <th className="pb-2 pl-2">Email</th>
                                   <th className="pb-2">Nom / Prénom</th>
                                   <th className="pb-2">Tel</th>
                                   <th className="pb-2">Salle Proposée</th>
                                   <th className="pb-2">Souhaits</th>
                                   <th className="pb-2">Message</th>
                                   <th className="pb-2">Date</th>
                                 </tr>
                               </thead>
                               <tbody>
                                 {cityDetails.map((detail) => (
                                   <tr key={detail.id} className="border-b border-gray-800/50 hover:bg-white/5">
                                     <td className="py-2 pl-2 font-mono text-gold">{detail.email}</td>
                                     <td className="py-2">{detail.first_name} {detail.last_name}</td>
                                     <td className="py-2 whitespace-nowrap">{detail.phone}</td>
                                     <td className="py-2 italic text-gray-400">{detail.venue_proposal || "-"}</td>
                                     <td className="py-2 text-gray-400 text-[10px]">{Array.isArray(detail.intentions) ? detail.intentions.join(", ") : detail.intentions || "-"}</td>
                                     <td className="py-2 text-gray-400 truncate max-w-[150px]" title={detail.message}>{detail.message || "-"}</td>
                                     <td className="py-2 text-gray-500 text-[10px] whitespace-nowrap">{detail.created_at ? new Date(detail.created_at).toLocaleString('fr-FR') : "-"}</td>
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                           </div>
                         ) : (
                           <p className="text-sm text-gray-500 italic">Aucun détail disponible pour ces votes.</p>
                         )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            {stats.length === 0 && <p className="text-gray-500 text-center py-10">Aucun vote pour le moment.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
