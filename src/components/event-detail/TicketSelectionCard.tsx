import React, { useState } from 'react';
import { Minus, Plus, ShieldCheck, X } from 'lucide-react';
import { TicketTier, TicketSelectionCardProps } from '../../types';
import { formatPrice } from '../../utils';
import { CHECKOUT_CONSTANTS } from '../../constants';

/**
 * @component TicketSelectionCard
 * @description Carte latérale de sélection des paliers de billets avec compteur dynamique,
 * calcul du montant global et déclencheur du passage vers le tunnel d'achat (conforme maquette).
 */
export const TicketSelectionCard: React.FC<TicketSelectionCardProps> = ({
  event,
  onProceedToCheckout,
}) => {
  const tiers: TicketTier[] = event.ticketTiers || [];

  const [quantities, setQuantities] = useState<Record<string, number>>({});

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
      className="sticky top-28 bg-white rounded-3xl sm:rounded-[32px] border border-gray-100/90 shadow-[0px_8px_28px_0px_#19192D0B] p-6 sm:p-7 text-left space-y-6"
    >
      <div>
        <span className="text-xs text-gray-400 font-medium block">
          À partir de
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {formatPrice(event.startingPrice, event.currency)}
          </span>
          <span className="text-xs text-gray-400 font-medium">/ billet</span>
        </div>
      </div>

      <div className="space-y-3">
        {tiers.length === 0 ? (
          <div className="p-5 text-center bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-500 font-medium">
            Aucun palier de billet disponible pour le moment.
          </div>
        ) : (
          tiers.map((tier) => {
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
                          {tier.remainingCount} RESTANTES
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
                          className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
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
          })
        )}
      </div>

      <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
        <div className="flex justify-between items-center text-gray-500">
          <span>{totalTickets} Billet{totalTickets > 1 ? 's' : ''}</span>
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
        <div className="flex justify-between items-center text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
          <span>Total</span>
          <span className="text-base font-black text-gray-900">
            {formatPrice(grandTotal, event.currency)}
          </span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={totalTickets === 0}
        type="button"
        className="w-full py-3.5 px-6 rounded-full bg-[#12142B] text-white text-xs sm:text-sm font-bold hover:bg-slate-900 disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md active:scale-[0.99] text-center"
      >
        Continuer au paiement
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        <span>Paiement sécurisé Wave · Orange Money · CB</span>
      </div>
    </div>
  );
};
