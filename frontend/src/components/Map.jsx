import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cities } from '../data/cities';

// Fix for default Leaflet icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const PulseIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div class='marker-pulse'></div>",
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Liste des villes prioritaires espacées pour couvrir tout le territoire sans surcharge
const mainCities = ["Paris", "Bruxelles", "Lyon", "Marseille", "Toulouse", "Bordeaux", "Nantes", "Brest", "Limoges", "Ajaccio", "Reims", "Dijon", "Grenoble", "Caen", "Bourges", "Nancy"];

const MarkersWithZoom = ({ onCitySelect }) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
    },
  });

  return (
    <>
      {cities.map((city) => {
        const isMainCity = mainCities.includes(city.name);
        const showLabel = zoom >= 7 || isMainCity;

        return (
          <Marker 
            key={city.name} 
            position={[city.lat, city.lng]} 
            icon={PulseIcon}
            eventHandlers={{
              click: () => {
                onCitySelect(city.name);
              },
            }}
          >
            <Tooltip 
              key={`${city.name}-${showLabel}`} // Force refresh
              permanent={showLabel} 
              direction="top" 
              offset={[0, -10]}
              className="custom-tooltip"
            >
              {city.name}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};

const MapComponent = ({ onCitySelect }) => {
  const center = [46.603354, 1.888334]; // Center of France

  return (
    <MapContainer 
      center={center} 
      zoom={6} 
      scrollWheelZoom={true} 
      className="h-screen w-full bg-[#1a1a1a]"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MarkersWithZoom onCitySelect={onCitySelect} />
    </MapContainer>
  );
};

export default MapComponent;
