import React, { useState } from 'react';
import { Minus, Plus, ShieldCheck, X } from 'lucide-react';
import { TicketTier, TicketSelectionCardProps } from '../../types';
import { formatPrice } from '../../utils';
import { CHECKOUT_CONSTANTS } from '../../constants';

/**
 * @component TicketSelectionCard
 * @description Carte latérale de sélection des paliers de billets avec compteur dynamique,
 * calcul du montant global et déclencheur du passage vers le tunnel d'achat.
 * @param {TicketSelectionCardProps} props - Contrat de propriétés du composant
 */
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
      price: 25000,
      available: true,
      remainingCount: 42,
    },
    {
      id: 'loge',
      name: 'Place Réservée',
      description: 'Premières loges + rencontre backstage',
      price: 50000,
      available: false,
      isSoldOut: true,
    },
  ];

  const [quantities, setQuantities] = useState<Record<string, number>>({
    standard: 2,
    vip: 1,
  });

  const handleUpdateQuantity = (tierId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[tierId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [tierId]: next };
    });
  };

  const totalTickets = Object.values(quantities).reduce((acc, q) => acc + q, 0);

  const subtotal = tiers.reduce((acc, tier) => {
    const qty = quantities[tier.id] || 0;
    return acc + tier.price * qty;
  }, 0);

  const serviceFees = totalTickets > 0 ? CHECKOUT_CONSTANTS.SERVICE_FEE : 0;
  const grandTotal = subtotal + serviceFees;

  const handleCheckout = () => {
    const selected = tiers
      .filter((t) => (quantities[t.id] || 0) > 0)
      .map((t) => ({
        tier: t,
        quantity: quantities[t.id],
      }));

    if (selected.length > 0 && onProceedToCheckout) {
      onProceedToCheckout(selected);
    }
  };

  return (
    <div
      id="ticket-selection-card"
      className="sticky top-28 bg-[#FAFBFD] rounded-3xl sm:rounded-[32px] border border-gray-200/90 shadow-lg p-6 sm:p-7 text-left space-y-6"
    >
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Billets disponibles
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Sélectionnez vos places et réservez instantanément
        </p>
      </div>

      <div className="space-y-3">
        {tiers.map((tier) => {
          const qty = quantities[tier.id] || 0;
          const isSoldOut = tier.isSoldOut || !tier.available;

          return (
            <div
              key={tier.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                isSoldOut
                  ? 'bg-gray-50/50 border-gray-200/60 opacity-60'
                  : qty > 0
                  ? 'bg-white border-gray-900/40 ring-1 ring-gray-900/10 shadow-xs'
                  : 'bg-white border-gray-200/80 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                      {tier.name}
                    </h4>
                    {tier.remainingCount && tier.remainingCount <= 50 && (
                      <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-2 py-0.5 rounded-full">
                        Plus que {tier.remainingCount}
                      </span>
                    )}
                  </div>
                  {tier.description && (
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                      {tier.description}
                    </p>
                  )}
                  <div className="font-extrabold text-xs sm:text-sm text-gray-900 mt-1.5">
                    {formatPrice(tier.price, event.currency)}
                  </div>
                </div>

                <div className="flex items-center self-center flex-shrink-0">
                  {isSoldOut ? (
                    <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                      <X className="w-3.5 h-3.5 text-gray-400" /> Épuisé
                    </span>
                  ) : (
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
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-gray-200/80 space-y-2 text-xs">
        <div className="flex justify-between items-center text-gray-500">
          <span>Sous-total</span>
          <span className="font-semibold text-gray-800">
            {formatPrice(subtotal, event.currency)}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-500">
          <span>Frais de service</span>
          <span className="font-semibold text-gray-800">
            {formatPrice(serviceFees, event.currency)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm font-extrabold text-gray-900">
          <span>Total</span>
          <span className="text-base font-black">
            {formatPrice(grandTotal, event.currency)}
          </span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={totalTickets === 0}
        type="button"
        className="w-full py-4 bg-[#0F141C] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Continuer</span>
        <span className="text-white/60">•</span>
        <span>{formatPrice(grandTotal, event.currency)}</span>
      </button>

      <div className="pt-1 text-center flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Paiement sécurisé • Wave & Orange Money</span>
      </div>
    </div>
  );
};
