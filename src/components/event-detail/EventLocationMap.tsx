import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { EventLocationMapProps } from '../../types';

/**
 * @component EventLocationMap
 * @description Carte vectorielle stylisée de l'emplacement de l'événement avec repères
 * géographiques et bouton d'itinéraire vers Google Maps.
 * @param {EventLocationMapProps} props - Contrat de propriétés du composant
 */
export const EventLocationMap: React.FC<EventLocationMapProps> = ({ event }) => {
  const venueTitle = event.venue || 'Dakar Arena';
  const locationSubtitle = event.location || 'Diamniadio, Sénégal';

  return (
    <div className="space-y-4 text-left pt-6">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
        {venueTitle}
      </h2>

      <div className="relative w-full h-56 sm:h-64 rounded-3xl overflow-hidden border border-gray-200/80 bg-[#E8EDF2] shadow-xs group">
        <svg
          viewBox="0 0 800 320"
          className="w-full h-full object-cover select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="800" height="320" fill="#E8EDF2" />

          <path
            d="M-50,80 C150,110 300,60 500,120 C650,160 750,140 850,160"
            fill="none"
            stroke="#D0D9E2"
            strokeWidth="32"
          />
          <path
            d="M-50,80 C150,110 300,60 500,120 C650,160 750,140 850,160"
            fill="none"
            stroke="#FBFDFF"
            strokeWidth="24"
          />

          <path
            d="M420,-30 C410,100 440,200 430,350"
            fill="none"
            stroke="#D0D9E2"
            strokeWidth="28"
          />
          <path
            d="M420,-30 C410,100 440,200 430,350"
            fill="none"
            stroke="#FBFDFF"
            strokeWidth="20"
          />

          <path
            d="M180,-20 L240,340"
            fill="none"
            stroke="#F3F6F9"
            strokeWidth="10"
          />
          <path
            d="M620,-20 L580,340"
            fill="none"
            stroke="#F3F6F9"
            strokeWidth="12"
          />
          <path
            d="M-20,240 L820,220"
            fill="none"
            stroke="#F3F6F9"
            strokeWidth="10"
          />

          <g transform="translate(415, 140)">
            <circle
              cx="0"
              cy="0"
              r="24"
              fill="#FFC23C"
              opacity="0.35"
              className="animate-ping"
            />
            <circle cx="0" cy="0" r="16" fill="#FFC23C" />
            <circle cx="0" cy="0" r="7" fill="#0F141C" />
          </g>

          <g transform="translate(425, 110)">
            <rect
              x="-60"
              y="-28"
              width="120"
              height="28"
              rx="8"
              fill="#0F141C"
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
            />
            <text
              x="0"
              y="-10"
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              {venueTitle}
            </text>
          </g>
        </svg>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              `${venueTitle}, ${locationSubtitle}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 text-xs font-semibold rounded-full shadow-sm border border-gray-200/80 transition-all cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-gray-700" />
            <span>Itinéraire</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span>{locationSubtitle}</span>
        </div>
        <span className="text-[11px] text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
          Accès TER & Autoroute
        </span>
      </div>
    </div>
  );
};
