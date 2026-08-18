import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { TicketTier } from '../../types/event';

interface TicketHolder {
  id: string;
  tierName: string;
  ticketIndex: number;
  fullName: string;
}

interface CustomerInfoStepProps {
  tiers: TicketTier[];
  quantities: Record<string, number>;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({
  tiers,
  quantities,
  customerFirstName,
  customerLastName,
  customerPhone,
  customerEmail,
  onChangeFirstName,
  onChangeLastName,
  onChangePhone,
  onChangeEmail,
  onBack,
  onContinue,
}) => {
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [ticketHolders, setTicketHolders] = useState<TicketHolder[]>([]);

  // Generate holder fields dynamically based on chosen quantities
  useEffect(() => {
    const list: TicketHolder[] = [];
    tiers.forEach((tier) => {
      const qty = quantities[tier.id] || 0;
      for (let i = 1; i <= qty; i++) {
        list.push({
          id: `${tier.id}-${i}`,
          tierName: tier.name.toUpperCase(),
          ticketIndex: i,
          fullName: i === 1 && list.length === 0 && customerFirstName && customerLastName
            ? `${customerFirstName} ${customerLastName}`
            : '',
        });
      }
    });

    setTicketHolders(list);
  }, [tiers, quantities]);

  const handleHolderNameChange = (id: string, name: string) => {
    setTicketHolders((prev) =>
      prev.map((h) => (h.id === id ? { ...h, fullName: name } : h))
    );
  };

  const handleCopyBuyerName = (id: string) => {
    const buyerName = `${customerFirstName} ${customerLastName}`.trim();
    if (buyerName) {
      handleHolderNameChange(id, buyerName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      customerFirstName.trim() &&
      customerLastName.trim() &&
      customerPhone.trim() &&
      customerEmail.trim()
    ) {
      onContinue();
    }
  };

  return (
    <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100/90 shadow-sm text-left">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. EN-TÊTE : TES INFORMATIONS                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="mb-6 sm:mb-7">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Tes informations
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Ton billet de confirmation et tes e-tickets seront envoyés à cette adresse.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Prénom & Nom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Prénom
            </label>
            <input
              type="text"
              required
              value={customerFirstName}
              onChange={(e) => onChangeFirstName(e.target.value)}
              placeholder="Aminata"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nom
            </label>
            <input
              type="text"
              required
              value={customerLastName}
              onChange={(e) => onChangeLastName(e.target.value)}
              placeholder="Diop"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Adresse email */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Adresse email
          </label>
          <input
            type="email"
            required
            value={customerEmail}
            onChange={(e) => onChangeEmail(e.target.value)}
            placeholder="aminata.diop@email.com"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Téléphone (+221 Addon) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Téléphone
          </label>
          <div className="flex rounded-2xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-gray-900 transition-all">
            <span className="inline-flex items-center px-4 bg-gray-50 text-gray-600 text-xs sm:text-sm font-semibold border-r border-gray-200 select-none">
              +221
            </span>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => onChangePhone(e.target.value)}
              placeholder="77 123 45 67"
              className="w-full px-4 py-3 bg-white text-xs sm:text-sm text-gray-900 focus:outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Newsletter Opt-in Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={newsletterOptIn}
              onChange={(e) => setNewsletterOptIn(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-xs text-gray-500 leading-tight">
              Je souhaite recevoir les offres et actualités de Sunu Events par email.
            </span>
          </label>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. SECTION : TITULAIRES DES BILLETS                           */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-6">
          <h2 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
            Titulaires des billets
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">
            Chaque billet est nominatif et associé à un QR code unique.
          </p>

          <div className="space-y-3">
            {ticketHolders.map((holder, index) => (
              <div
                key={holder.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#F9F9FB] border border-gray-100/90"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                    {holder.tierName} • BILLET {holder.ticketIndex}
                  </span>

                  {index === 0 && (
                    <button
                      type="button"
                      onClick={() => handleCopyBuyerName(holder.id)}
                      className="text-[11px] text-[#FF4747] hover:underline font-bold transition-colors cursor-pointer"
                    >
                      Identique à l'acheteur
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={holder.fullName}
                  onChange={(e) => handleHolderNameChange(holder.id, e.target.value)}
                  placeholder="Nom complet du titulaire"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. BOUTONS D'ACTIONS (RETOUR & CONTINUER)                      */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
          <button
            onClick={onBack}
            type="button"
            className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            Retour
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F141C] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black active:scale-98 transition-all shadow-md cursor-pointer"
          >
            <span>Continuer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
