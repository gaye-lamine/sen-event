import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { EventItem } from '../../types/event';

interface EventLocationMapProps {
  event: EventItem;
}

export const EventLocationMap: React.FC<EventLocationMapProps> = ({ event }) => {
  const venueTitle = event.venue || 'Dakar Arena';
  const locationSubtitle = event.location || 'Diamniadio, Sénégal';

  return (
    <div className="space-y-4 text-left pt-6">
      {/* Location Title */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
        {venueTitle}
      </h2>

      {/* Visual Stylized Map Card */}
      <div className="relative w-full h-56 sm:h-64 rounded-3xl overflow-hidden border border-gray-200/80 bg-[#E8EDF2] shadow-xs group">
        
        {/* Stylized SVG Map Representation of Dakar Arena / Diamniadio */}
        <svg
          viewBox="0 0 800 320"
          className="w-full h-full object-cover select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background land */}
          <rect width="800" height="320" fill="#EBF0F4" />
          
          {/* Water/Lagoon accents */}
          <path
            d="M0,160 Q180,140 320,180 T600,160 T800,190 L800,320 L0,320 Z"
            fill="#D9E6EF"
            opacity="0.6"
          />

          {/* Secondary Roads */}
          <path
            d="M50,0 L180,320 M280,0 L320,320 M550,0 L480,320 M700,0 L780,320"
            stroke="#FFFFFF"
            strokeWidth="5"
          />
          <path
            d="M0,80 Q300,90 800,70 M0,240 Q400,220 800,260"
            stroke="#FFFFFF"
            strokeWidth="6"
          />

          {/* Primary Highway / Autoroute de l'Avenir (A1) */}
          <path
            d="M0,150 C200,130 350,190 500,150 C650,110 750,140 800,130"
            stroke="#FDE047"
            strokeWidth="7"
          />
          <path
            d="M0,150 C200,130 350,190 500,150 C650,110 750,140 800,130"
            stroke="#F59E0B"
            strokeWidth="3"
          />

          {/* Interchange Loop around Diamniadio */}
          <circle cx="320" cy="175" r="32" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <circle cx="320" cy="175" r="32" fill="none" stroke="#FDE047" strokeWidth="2.5" />

          {/* Landmark Pins / Badges */}
          <g transform="translate(140, 75)">
            <rect x="0" y="0" width="130" height="24" rx="12" fill="#FFFFFF" opacity="0.9" />
            <circle cx="12" cy="12" r="4" fill="#10B981" />
            <text x="22" y="15" fontSize="9" fontWeight="bold" fill="#374151">Gare TER Diamniadio</text>
          </g>

          <g transform="translate(480, 80)">
            <rect x="0" y="0" width="135" height="24" rx="12" fill="#FFFFFF" opacity="0.9" />
            <circle cx="12" cy="12" r="4" fill="#6366F1" />
            <text x="22" y="15" fontSize="9" fontWeight="bold" fill="#374151">Stade Abdoulaye Wade</text>
          </g>

          <g transform="translate(490, 200)">
            <rect x="0" y="0" width="125" height="24" rx="12" fill="#FFFFFF" opacity="0.9" />
            <circle cx="12" cy="12" r="4" fill="#EC4899" />
            <text x="22" y="15" fontSize="9" fontWeight="bold" fill="#374151">Centre Conférences CICAD</text>
          </g>

          {/* Main Dakar Arena Red Target Marker */}
          <g transform="translate(320, 160)">
            <circle cx="0" cy="0" r="16" fill="#EF4444" opacity="0.25" />
            <circle cx="0" cy="0" r="10" fill="#EF4444" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            
            {/* Label Tooltip Badge */}
            <g transform="translate(14, -12)">
              <rect x="0" y="0" width="90" height="24" rx="12" fill="#111827" />
              <text x="10" y="15" fontSize="9.5" fontWeight="bold" fill="#FFFFFF">Dakar Arena</text>
            </g>
          </g>
        </svg>

        {/* Floating Info Overlay on bottom left */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-gray-100 text-left flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
          <div>
            <div className="font-bold text-xs text-gray-900">{venueTitle}</div>
            <div className="text-[10px] text-gray-500">{locationSubtitle}</div>
          </div>
        </div>

        {/* Itinerary Link Button on top right */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            venueTitle + ' ' + locationSubtitle
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-xs font-semibold text-gray-700 hover:text-gray-950 hover:bg-white flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Itinéraire</span>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </a>
      </div>
    </div>
  );
};
