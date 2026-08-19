import React from 'react';
import { Download, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderConfirmationViewProps {
  orderNumber?: string;
  customerEmail?: string;
  onNavigateHome: () => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  orderNumber = 'SN-284916',
  customerEmail = 'aminata.diop@email.com',
  onNavigateHome,
}) => {
  React.useEffect(() => {
    // Confetti celebration on arrival
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFC23C', '#10B981', '#1DC6F6', '#FF4747'],
    });
  }, []);

  const handleDownloadTickets = () => {
    // Generate simple printable view / download notification
    window.print();
  };

  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center overflow-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* ATMOSPHERIC AMBIENT GLOWS                                     */}
      {/* ------------------------------------------------------------- */}
      {/* Top Right Golden Ambient Glow */}
      <div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#FFC23C] opacity-25 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      {/* Left Purple Ambient Glow */}
      <div
        className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[#8B5CF6] opacity-15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        
        {/* ------------------------------------------------------------- */}
        {/* 1. CARTE BANCAIRE / BILLET ILLUSTRATION AVEC BADGE CHECK      */}
        {/* ------------------------------------------------------------- */}
        <div className="relative mb-6">
          <svg
            width="84"
            height="64"
            viewBox="0 0 84 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
          >
            {/* Credit Card Body */}
            <rect
              x="3"
              y="3"
              width="68"
              height="46"
              rx="9"
              fill="#FFFFFF"
              stroke="#0F141C"
              strokeWidth="2.5"
            />
            {/* Cyan Card Top Bar */}
            <path
              d="M4.5 14H69.5"
              stroke="#06B6D4"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Chip / Card Mini Details */}
            <rect
              x="12"
              y="26"
              width="14"
              height="10"
              rx="2.5"
              stroke="#0F141C"
              strokeWidth="2"
              fill="#F9FAFB"
            />
            {/* Bottom-Right Overlapping Cyan Success Check Badge */}
            <circle
              cx="58"
              cy="45"
              r="12"
              fill="#A5F3FC"
              stroke="#0F141C"
              strokeWidth="2.5"
            />
            <path
              d="M53 45.5L56.5 49L63.5 41.5"
              stroke="#0F141C"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. TITRE, NUMÉRO DE COMMANDE & EMAIL                          */}
        {/* ------------------------------------------------------------- */}
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Paiement confirmé !
        </h1>

        <p className="text-xs text-gray-500 font-medium mt-2">
          Numéro de commande <strong className="text-gray-900 font-bold">#{orderNumber}</strong>
        </p>

        <p className="text-xs text-gray-400 mt-1 max-w-md leading-relaxed">
          Les billets ont été envoyés à <span className="text-gray-600">{customerEmail}</span> — retrouve-les aussi dans "Mes billets"
        </p>

        {/* ------------------------------------------------------------- */}
        {/* 3. EVENTAIL DE BILLETS STYLISÉS (STANDARD - V.I.P - STANDARD) */}
        {/* ------------------------------------------------------------- */}
        <div className="relative w-full max-w-md h-36 sm:h-40 my-8 flex items-end justify-center">
          
          {/* Baseline horizontal line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0F141C] z-0" />

          {/* Left Dark Ticket (STANDARD) */}
          <div
            className="absolute bottom-0 left-12 sm:left-16 w-28 sm:w-32 h-20 sm:h-22 bg-[#0F141C] text-white/30 rounded-t-xl z-10 origin-bottom-right shadow-lg transform -rotate-15 hover:-rotate-12 transition-transform select-none flex flex-col items-center justify-center border-t border-l border-r border-gray-700/50"
            style={{
              clipPath:
                'polygon(0% 0%, 100% 0%, 100% 35%, 90% 50%, 100% 65%, 100% 100%, 0% 100%, 0% 65%, 10% 50%, 0% 35%)',
            }}
          >
            <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase">
              STANDARD
            </span>
          </div>

          {/* Right Dark Ticket (STANDARD) */}
          <div
            className="absolute bottom-0 right-12 sm:right-16 w-28 sm:w-32 h-20 sm:h-22 bg-[#0F141C] text-white/30 rounded-t-xl z-10 origin-bottom-left shadow-lg transform rotate-15 hover:rotate-12 transition-transform select-none flex flex-col items-center justify-center border-t border-l border-r border-gray-700/50"
            style={{
              clipPath:
                'polygon(0% 0%, 100% 0%, 100% 35%, 90% 50%, 100% 65%, 100% 100%, 0% 100%, 0% 65%, 10% 50%, 0% 35%)',
            }}
          >
            <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase">
              STANDARD
            </span>
          </div>

          {/* Center Golden/Amber Ticket (V.I.P) */}
          <div
            className="relative bottom-0 w-32 sm:w-36 h-24 sm:h-28 bg-[#FFC23C] text-gray-950 rounded-t-2xl z-20 shadow-xl flex flex-col items-center justify-center select-none border-t-2 border-l border-r border-amber-300 transform hover:-translate-y-1 transition-transform"
            style={{
              clipPath:
                'polygon(0% 0%, 100% 0%, 100% 35%, 90% 50%, 100% 65%, 100% 100%, 0% 100%, 0% 65%, 10% 50%, 0% 35%)',
            }}
          >
            <span className="text-sm sm:text-base font-black tracking-widest text-[#855B04]">
              V.I.P
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4. BOUTONS D'ACTIONS CENTRÉS                                  */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-2">
          
          {/* Retour à l'accueil */}
          <button
            onClick={onNavigateHome}
            type="button"
            className="px-6 sm:px-7 py-3 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            Retour à l'accueil
          </button>

          {/* Télécharger mes billets */}
          <button
            onClick={handleDownloadTickets}
            type="button"
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#0F141C] text-white text-xs sm:text-sm font-bold hover:bg-black active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <span>Télécharger mes billets</span>
            <Download className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
