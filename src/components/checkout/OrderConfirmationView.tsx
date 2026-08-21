import React, { useState, useEffect } from 'react';
import { Download, QrCode, Ticket as TicketIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderConfirmationViewProps } from '../../types';
import { CHECKOUT_CONSTANTS } from '../../constants';
import { DigitalTicketModal } from '../tickets/DigitalTicketModal';

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  orderNumber = CHECKOUT_CONSTANTS.DEFAULT_ORDER_NUMBER,
  customerEmail = CHECKOUT_CONSTANTS.DEFAULT_DEMO_BUYER.EMAIL,
  onNavigateHome,
}) => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFC23C', '#10B981', '#1DC6F6', '#FF4747'],
    });
  }, []);

  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center overflow-hidden">
      <div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#FFC23C] opacity-25 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[#8B5CF6] opacity-15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        <div className="relative mb-5 flex items-center justify-center">
          <img
            src="/gif/approuve.gif"
            alt="Paiement approuvé"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-sm select-none"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Paiement confirmé !
        </h1>

        <p className="text-xs text-gray-500 font-medium mt-2">
          Numéro de commande <strong className="text-gray-900 font-bold">#{orderNumber}</strong>
        </p>

        <p className="text-xs text-gray-400 mt-1 max-w-md leading-relaxed">
          Les billets ont été envoyés à <span className="text-gray-600 font-medium">{customerEmail}</span> — retrouve-les aussi dans "Mes billets"
        </p>

        {/* Éventail de billets interactif */}
        <div
          onClick={() => setIsTicketModalOpen(true)}
          title="Cliquer pour afficher votre billet avec QR Code"
          className="relative w-full max-w-md h-36 sm:h-40 my-8 flex items-end justify-center cursor-pointer group"
        >
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0F141C] z-0" />

          <div
            className="absolute bottom-0 left-12 sm:left-16 w-28 sm:w-32 h-20 sm:h-22 bg-[#0F141C] text-white/30 rounded-t-xl z-10 origin-bottom-right shadow-lg transform -rotate-15 group-hover:-rotate-18 transition-transform select-none flex flex-col items-center justify-center border-t border-l border-r border-gray-700/50"
            style={{
              clipPath:
                'polygon(0% 0%, 100% 0%, 100% 35%, 90% 50%, 100% 65%, 100% 100%, 0% 100%, 0% 65%, 10% 50%, 0% 35%)',
            }}
          >
            <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase">
              STANDARD
            </span>
          </div>

          <div
            className="absolute bottom-0 right-12 sm:right-16 w-28 sm:w-32 h-20 sm:h-22 bg-[#0F141C] text-white/30 rounded-t-xl z-10 origin-bottom-left shadow-lg transform rotate-15 group-hover:rotate-18 transition-transform select-none flex flex-col items-center justify-center border-t border-l border-r border-gray-700/50"
            style={{
              clipPath:
                'polygon(0% 0%, 100% 0%, 100% 35%, 90% 50%, 100% 65%, 100% 100%, 0% 100%, 0% 65%, 10% 50%, 0% 35%)',
            }}
          >
            <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase">
              STANDARD
            </span>
          </div>

          <div
            className="relative bottom-0 w-32 sm:w-36 h-24 sm:h-28 bg-[#FFC23C] text-gray-950 rounded-t-2xl z-20 shadow-xl flex flex-col items-center justify-center select-none border-t-2 border-l border-r border-amber-300 transform group-hover:-translate-y-2 transition-transform"
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

        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-2">
          <button
            onClick={onNavigateHome}
            type="button"
            className="px-6 sm:px-7 py-3 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            Retour à l'accueil
          </button>

          <button
            onClick={() => setIsTicketModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#0F141C] hover:bg-black text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#FFC23C]" />
            <span>Voir mon billet numérique</span>
          </button>
        </div>
      </div>

      {/* Modale d'inspection et d'impression du billet numérique */}
      <DigitalTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        orderNumber={orderNumber}
      />
    </div>
  );
};
