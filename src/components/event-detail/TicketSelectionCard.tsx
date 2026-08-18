import React, { useState } from 'react';
import { Minus, Plus, ShieldCheck, X } from 'lucide-react';
import { EventItem, TicketTier } from '../../types/event';

interface TicketSelectionCardProps {
  event: EventItem;
  onProceedToCheckout?: (selectedTiers: { tier: TicketTier; quantity: number }[]) => void;
}

export const TicketSelectionCard: React.FC<TicketSelectionCardProps> = ({
  event,
  onProceedToCheckout,
}) => {
  const tiers: TicketTier[] = event.ticketTiers || [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Accès général, places debout',
      price: event.startingPrice || 10000,
      available: true,
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Zone VIP, boisson offerte + accès rapide',
      price: (event.startingPrice || 10000) * 2.5,
      available: true,
      remainingCount: 42,
    },
    {
      id: 'carre-or',
      name: 'Carré Or',
      description: 'Premières loges + rencontre backstage',
      price: (event.startingPrice || 10000) * 5,
      available: false,
      isSoldOut: true,
    },
  ];

  // Quantities for each tier: { [tierId]: number }
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleUpdateQuantity = (tierId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[tierId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [tierId]: next };
    });
  };

  // Calculate totals
  const totalTicketsCount = Object.values(quantities).reduce((acc, q) => acc + q, 0);
  const totalAmount = tiers.reduce((acc, tier) => {
    const q = quantities[tier.id] || 0;
    return acc + tier.price * q;
  }, 0);

  const formattedStartingPrice = new Intl.NumberFormat('fr-FR').format(event.startingPrice || 10000);
  const formattedTotal = new Intl.NumberFormat('fr-FR').format(totalAmount);

  const handleCheckout = () => {
    if (totalTicketsCount === 0) return;
    const selected = tiers
      .filter((t) => (quantities[t.id] || 0) > 0)
      .map((t) => ({ tier: t, quantity: quantities[t.id] }));
    onProceedToCheckout?.(selected);
  };

  return (
    <div id="ticket-selection-card" className="sticky top-40 w-full bg-white rounded-3xl border border-gray-100/90 shadow-xl shadow-gray-200/50 p-6 text-left">
      
      {/* Price Header */}
      <div className="mb-5">
        <span className="text-xs text-gray-400 block font-medium">À partir de</span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {formattedStartingPrice} {event.currency || 'F'}
          </span>
          <span className="text-xs text-gray-400 font-medium">/ billet</span>
        </div>
      </div>

      {/* Ticket Tiers List */}
      <div className="space-y-3 mb-6">
        {tiers.map((tier) => {
          const qty = quantities[tier.id] || 0;
          const isSoldOut = tier.isSoldOut || !tier.available;

          return (
            <div
              key={tier.id}
              className={`p-4 rounded-2xl border transition-all ${
                isSoldOut
                  ? 'bg-gray-50/60 border-gray-100 opacity-60'
                  : qty > 0
                  ? 'bg-white border-gray-900/40 ring-1 ring-gray-900/10 shadow-xs'
                  : 'bg-white border-gray-200/80 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                
                {/* Tier Title & Badges */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-gray-900">
                      {tier.name}
                    </span>
                    {tier.remainingCount && !isSoldOut && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {tier.remainingCount} RESTANTES
                      </span>
                    )}
                  </div>
                  {tier.description && (
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                      {tier.description}
                    </p>
                  )}
                </div>

                {/* Status or Price */}
                {isSoldOut && (
                  <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                    <X className="w-3 h-3 text-gray-400" /> Épuisé
                  </span>
                )}
              </div>

              {/* Price & Quantity Controls */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <div className="font-extrabold text-xs sm:text-sm text-gray-900">
                  {new Intl.NumberFormat('fr-FR').format(tier.price)} {event.currency || 'F'}
                </div>

                {!isSoldOut && (
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleUpdateQuantity(tier.id, -1)}
                      disabled={qty === 0}
                      type="button"
                      className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-gray-900 w-4 text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(tier.id, 1)}
                      type="button"
                      className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2 py-4 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>{totalTicketsCount} {totalTicketsCount > 1 ? 'Billets' : 'Billet'}</span>
          <span className="font-medium text-gray-900">{formattedTotal} {event.currency || 'F'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Frais de service</span>
          <span className="font-medium text-gray-900">0 {event.currency || 'F'}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200 text-sm font-extrabold text-gray-900">
          <span>Total</span>
          <span className="text-base">{formattedTotal} {event.currency || 'F'}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleCheckout}
        disabled={totalTicketsCount === 0}
        type="button"
        className={`w-full py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer ${
          totalTicketsCount > 0
            ? 'bg-[#0F141C] text-white hover:bg-black'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-80'
        }`}
      >
        Continuer au paiement
      </button>

      {/* Security Footer */}
      <div className="mt-3 text-center flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Paiement sécurisé Wave • Orange Money • CB</span>
      </div>
    </div>
  );
};
