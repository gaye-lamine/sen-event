import React from 'react';
import { Search } from 'lucide-react';
import { HeroSectionProps } from '../../types';
import { FloatingTickets } from './FloatingTickets';

/**
 * @component HeroSection
 * @description Section d'en-tête de la page d'accueil avec typographie soignée,
 * halo lumineux pulsing `#FFC23C`, barre de recherche instantanée et billets VIP 3D flottants.
 * @param {HeroSectionProps} props - Contrat de propriétés du composant
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery = '',
  onSearch,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const target = document.getElementById('all-events-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-24 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 bg-white">
      <div
        className="absolute pointer-events-none -z-0 animate-orb-pulse"
        style={{
          width: '320px',
          height: '320px',
          top: '-80px',
          right: '-80px',
          borderRadius: '160px',
          background: '#FFC23C',
          opacity: 0.35,
          filter: 'blur(50px)',
          backdropFilter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] tracking-tight text-gray-900 leading-[1.18] max-w-3xl mx-auto">
          <span>Sunu moments, sunu</span>
          <br className="hidden sm:block" />{' '}
          <span className="relative inline-block mt-1 sm:mt-0">
            <span className="relative z-10">tickets</span>
            <span
              className="absolute bottom-[3px] left-[-4px] right-[-4px] h-[10px] sm:h-[13px] bg-[#FFC23C]/75 rounded-xs -z-0"
              aria-hidden="true"
            />
          </span>
        </h1>

        <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
          Concerts, matchs, festivals, formations... trouve ton prochain sortie et paie en 2 clics avec Wave ou Orange Money. Ton billet arrive direct par mail, prêt à scanner.
        </p>

        <div className="mt-7 sm:mt-9 max-w-xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-full p-1.5 pl-5 sm:pl-6 shadow-xl shadow-gray-200/50 border border-gray-200/90 hover:border-gray-300 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-900/10 transition-all"
          >
            <Search className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Wally Seck, Dakar Arena, Sénégal vs..."
              className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-[#0F141C] text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-black active:scale-98 transition-all flex-shrink-0 cursor-pointer shadow-sm"
            >
              Chercher
            </button>
          </form>
        </div>
      </div>

      <FloatingTickets />
    </section>
  );
};
