import React from 'react';
import { FooterProps } from '../../types';

export const Footer: React.FC<FooterProps> = ({ onNavigateHome }) => {
  return (
    <footer className="relative overflow-hidden bg-[#12142B] text-white pt-14 sm:pt-16 pb-12">
      {/* Left #FFC23C9C Ambient Glow */}
      <div
        className="absolute top-0 left-[-80px] w-[360px] h-[360px] pointer-events-none -z-0"
        style={{
          borderRadius: '180px',
          background: '#FFC23C',
          opacity: 0.18,
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* Right #FFC23C9C Ambient Glow */}
      <div
        className="absolute bottom-0 right-[-80px] w-[360px] h-[360px] pointer-events-none -z-0"
        style={{
          borderRadius: '180px',
          background: '#FFC23C',
          opacity: 0.18,
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 text-left">
          {/* Brand Column */}
          <div className="lg:col-span-5 pr-0 lg:pr-8">
            <button
              onClick={onNavigateHome}
              type="button"
              className="font-bold text-lg sm:text-xl tracking-tight text-white hover:text-amber-400 transition-colors cursor-pointer text-left"
            >
              Sunu Events
            </button>
            <p className="mt-3.5 text-xs sm:text-sm text-[#8E92BC] leading-relaxed max-w-sm">
              La billetterie faite pour le Sénégal : paiement local, billets QR infalsifiables, et une équipe basée à Dakar.
            </p>
          </div>

          {/* EXPLORER Column */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">
              EXPLORER
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-[#8E92BC]">
              <li>
                <a href="#all-events-section" className="hover:text-white transition-colors">
                  Concerts
                </a>
              </li>
              <li>
                <a href="#all-events-section" className="hover:text-white transition-colors">
                  Matchs
                </a>
              </li>
              <li>
                <a href="#all-events-section" className="hover:text-white transition-colors">
                  Festivals
                </a>
              </li>
              <li>
                <a href="#all-events-section" className="hover:text-white transition-colors">
                  Formations
                </a>
              </li>
            </ul>
          </div>

          {/* SUNU EVENTS Column */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">
              SUNU EVENTS
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-[#8E92BC]">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Organisateurs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Aide & contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* LÉGAL Column */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">
              LÉGAL
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-[#8E92BC]">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Remboursements
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-[#23264A] pt-8 text-left">
          <p className="text-xs text-[#8E92BC]">
            © 2026 NIANE TECHNOLOGIES SUARL — Dakar, Sénégal
          </p>
        </div>
      </div>
    </footer>
  );
};
